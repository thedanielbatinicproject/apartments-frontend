"use client";

import { useRef, useState } from "react";
import {
  Upload,
  Star,
  Trash2,
  ArrowUp,
  ArrowDown,
  ImageOff,
  Loader2,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fileUrl } from "@/lib/api/files";
import { useMutation } from "@/hooks/use-async";
import {
  uploadApartmentImage,
  deleteApartmentImage,
  setApartmentCoverImage,
  reorderApartmentImages,
} from "@/lib/api/apartments";
import type { ApartmentImageResponse } from "@/lib/api/types";
import { EmptyState, ErrorState } from "@/components/intranet/ui/DataStates";
import { useConfirm } from "@/components/ui/confirm-dialog";

// ============================================================
// Tab "Slike".
//
// Mobilna odluka: redoslijed se mijenja GUMBIMA gore/dolje, ne
// drag&dropom. HTML5 drag&drop na dodir jednostavno ne radi, a
// touch reorder biblioteke su teške i i dalje se sudaraju sa
// scrollom stranice. Strelice su pouzdane i pristupačne.
//
// Upload nudi dva ulaza: galerija i kamera (capture atribut),
// jer se slike apartmana često slikaju upravo mobitelom.
// ============================================================

interface ApartmentImagesTabProps {
  apartmentId: number;
  images: ApartmentImageResponse[];
  onChanged: () => void | Promise<void>;
}

export function ApartmentImagesTab({
  apartmentId,
  images,
  onChanged,
}: ApartmentImagesTabProps) {
  const confirm = useConfirm();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [busyImageId, setBusyImageId] = useState<number | null>(null);
  const [failedThumbs, setFailedThumbs] = useState<Set<number>>(new Set());

  // Lokalni redoslijed — omogućuje trenutni odaziv strelica
  // prije nego backend potvrdi.
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);

  const upload = useMutation(
    async (files: FileList) => {
      // Uploada redom, ne paralelno — mobilne mreže i backend
      // lakše podnose jedan po jedan upload.
      for (const file of Array.from(files)) {
        await uploadApartmentImage(apartmentId, file);
      }
    },
    { onSuccess: () => void onChanged() }
  );

  const remove = useMutation(
    async (imageId: number) => {
      await deleteApartmentImage(apartmentId, imageId);
    },
    { onSuccess: () => void onChanged() }
  );

  const makeCover = useMutation(
    async (imageId: number) => {
      await setApartmentCoverImage(apartmentId, imageId);
    },
    { onSuccess: () => void onChanged() }
  );

  const reorder = useMutation(
    async (orderedIds: number[]) => {
      await reorderApartmentImages(apartmentId, orderedIds);
    },
    { onSuccess: () => void onChanged() }
  );

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    await upload.run(files);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sorted.length) return;

    const next = [...sorted];
    [next[index], next[target]] = [next[target], next[index]];

    setBusyImageId(sorted[index].id);
    await reorder.run(next.map((img) => img.id));
    setBusyImageId(null);
  };

  const handleDelete = async (image: ApartmentImageResponse) => {
    const confirmed = await confirm({
      title: "Obrisati sliku?",
      description: "Slika se trajno uklanja s javne stranice apartmana.",
      warning: image.cover
        ? "Ovo je naslovna slika — nakon brisanja apartman ostaje bez naslovne dok ne odaberete drugu."
        : undefined,
      confirmLabel: "Obriši sliku",
      variant: "destructive",
    });
    if (!confirmed) return;

    setBusyImageId(image.id);
    await remove.run(image.id);
    setBusyImageId(null);
  };

  const handleMakeCover = async (imageId: number) => {
    setBusyImageId(imageId);
    await makeCover.run(imageId);
    setBusyImageId(null);
  };

  const anyError =
    upload.error ?? remove.error ?? makeCover.error ?? reorder.error;

  return (
    <div className="space-y-4">
      {/* Upload */}
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-4">
        <div className="flex flex-col gap-2 xs:flex-row">
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={upload.isPending}
            className="inline-flex min-h-[2.75rem] flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            {upload.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {upload.isPending ? "Upload u tijeku..." : "Odaberi slike"}
          </button>

          {/* Kamera — na desktopu je capture ignoriran, pa gumb skrivamo */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={upload.isPending}
            className="inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-all active:scale-[0.98] disabled:opacity-60 sm:hidden"
          >
            <Camera className="h-4 w-4" />
            Slikaj
          </button>
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          Možete odabrati više slika odjednom. Uploadaju se jedna po jedna.
        </p>

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>

      {anyError != null && (
        <ErrorState error={anyError} context="Operacija nad slikama" compact />
      )}

      {/* Galerija */}
      {sorted.length === 0 ? (
        <EmptyState
          icon={ImageOff}
          title="Nema slika"
          description="Dodajte barem jednu sliku — prva uploadana automatski postaje naslovna na javnoj stranici."
        />
      ) : (
        <ul className="space-y-2.5">
          {sorted.map((image, index) => {
            const src = fileUrl(image.url);
            const thumbFailed = failedThumbs.has(image.id);
            const isBusy = busyImageId === image.id;

            return (
              <li
                key={image.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border bg-card p-2.5 transition-all",
                  image.cover ? "border-primary/40" : "border-border",
                  isBusy && "opacity-60"
                )}
              >
                {/* Thumbnail */}
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-muted xs:h-20 xs:w-28">
                  {src && !thumbFailed ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={`Slika ${index + 1}`}
                      loading="lazy"
                      onError={() =>
                        setFailedThumbs((prev) =>
                          new Set(prev).add(image.id)
                        )
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageOff className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}

                  {isBusy && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                      <Loader2 className="h-4 w-4 animate-spin text-foreground" />
                    </div>
                  )}
                </div>

                {/* Info + akcije */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      #{index + 1}
                    </span>
                    {image.cover && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[0.625rem] font-semibold text-primary">
                        <Star className="h-2.5 w-2.5 fill-current" />
                        Naslovna
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    {!image.cover && (
                      <button
                        type="button"
                        onClick={() => void handleMakeCover(image.id)}
                        disabled={isBusy}
                        className="inline-flex min-h-[2rem] items-center gap-1 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                      >
                        <Star className="h-3.5 w-3.5" />
                        Naslovna
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => void handleDelete(image)}
                      disabled={isBusy}
                      className="inline-flex min-h-[2rem] items-center gap-1 rounded-lg px-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Obriši
                    </button>
                  </div>
                </div>

                {/* Redoslijed — strelice umjesto drag&dropa */}
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => void move(index, -1)}
                    disabled={index === 0 || isBusy || reorder.isPending}
                    aria-label="Pomakni gore"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground active:scale-95 disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void move(index, 1)}
                    disabled={
                      index === sorted.length - 1 || isBusy || reorder.isPending
                    }
                    aria-label="Pomakni dolje"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground active:scale-95 disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
