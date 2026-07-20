"use client";

import { useRef, useState } from "react";
import { Upload, ImageOff, Loader2, Camera } from "lucide-react";
import { useMutation } from "@/hooks/use-async";
import { uploadCompanyLogo } from "@/lib/api/companies";
import { fileUrl } from "@/lib/api/files";
import { ErrorState } from "@/components/intranet/ui/DataStates";

// ============================================================
// Logo firme — ispisuje se u zaglavlju PDF dokumenata.
//
// Upload je odvojen od ostatka forme jer ide zasebnom rutom
// (multipart) i djeluje odmah, dok se ostala polja spremaju
// zajedno jednim gumbom.
// ============================================================

interface CompanyLogoSectionProps {
  companyId: number;
  logoUrl: string | null;
  onUploaded: () => void | Promise<void>;
}

export function CompanyLogoSection({
  companyId,
  logoUrl,
  onUploaded,
}: CompanyLogoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [previewFailed, setPreviewFailed] = useState(false);

  const upload = useMutation(
    async (file: File) => {
      await uploadCompanyLogo(companyId, file);
    },
    {
      onSuccess: () => {
        setPreviewFailed(false);
        void onUploaded();
      },
    }
  );

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    await upload.run(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const src = fileUrl(logoUrl);
  const showLogo = src && !previewFailed;

  return (
    <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Logo</h3>
        <p className="mt-0.5 text-xs text-muted-foreground text-pretty">
          Prikazuje se u zaglavlju računa i ponuda.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background">
          {showLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt="Logo firme"
              onError={() => setPreviewFailed(true)}
              className="h-full w-full object-contain p-1.5"
            />
          ) : (
            <ImageOff className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={upload.isPending}
            className="inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {upload.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {logoUrl ? "Promijeni logo" : "Dodaj logo"}
          </button>

          {/* Slikanje logotipa s papira — na desktopu capture ne radi */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={upload.isPending}
            className="inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground transition-all active:scale-[0.98] disabled:opacity-60 sm:hidden"
          >
            <Camera className="h-4 w-4" />
            Slikaj
          </button>
        </div>
      </div>

      {src && previewFailed && (
        <p className="text-xs text-amber-600">
          Logo je spremljen, ali se ne može prikazati. Pokušajte s drugom
          slikom.
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => void handleFile(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => void handleFile(e.target.files)}
      />

      {upload.error != null && (
        <ErrorState error={upload.error} context="Upload logotipa" compact />
      )}
    </section>
  );
}
