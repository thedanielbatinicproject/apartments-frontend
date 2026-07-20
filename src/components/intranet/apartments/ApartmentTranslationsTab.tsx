"use client";

import { useEffect, useState } from "react";
import { Check, Trash2, Loader2, Plus, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync, useMutation } from "@/hooks/use-async";
import {
  getApartmentTranslations,
  upsertApartmentTranslation,
  deleteApartmentTranslation,
} from "@/lib/api/apartments";
import type { ApartmentTranslationResponse } from "@/lib/api/types";
import { AsyncBoundary, ErrorState } from "@/components/intranet/ui/DataStates";
import { useConfirm } from "@/components/ui/confirm-dialog";

// ============================================================
// Tab "Prijevodi".
//
// Backend NEMA auto-prijevod ni AI generaciju — svaki jezik se
// unosi ručno (PUT .../translations/{lang} je upsert). Zato je
// najvažnije jasno pokazati KOJI JEZICI NEDOSTAJU, jer se inače
// na javnoj stranici tiho koristi fallback jezik.
// ============================================================

/** Jezici koje projekt planira podržavati (i18n iz AGENTS.md). */
const SUPPORTED_LANGUAGES = [
  { code: "hr", label: "Hrvatski" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
] as const;

interface ApartmentTranslationsTabProps {
  apartmentId: number;
  onChanged: () => void | Promise<void>;
}

export function ApartmentTranslationsTab({
  apartmentId,
  onChanged,
}: ApartmentTranslationsTabProps) {
  const [activeLang, setActiveLang] = useState<string>("hr");

  const translations = useAsync<ApartmentTranslationResponse[]>(
    () => getApartmentTranslations(apartmentId),
    [apartmentId]
  );

  return (
    <div className="space-y-4">
      <AsyncBoundary
        isLoading={translations.isLoading}
        error={translations.error}
        data={translations.data}
        onRetry={() => void translations.refetch()}
        context="Dohvat prijevoda"
        // Prazan niz je legitiman slučaj (novi apartman), ne "greška"
        emptyFallback={
          <TranslationEditor
            apartmentId={apartmentId}
            lang={activeLang}
            existing={null}
            allTranslations={[]}
            activeLang={activeLang}
            onSelectLang={setActiveLang}
            onSaved={async () => {
              await translations.refetch();
              await onChanged();
            }}
          />
        }
      >
        {(list) => (
          <TranslationEditor
            apartmentId={apartmentId}
            lang={activeLang}
            existing={list.find((t) => t.languageCode === activeLang) ?? null}
            allTranslations={list}
            activeLang={activeLang}
            onSelectLang={setActiveLang}
            onSaved={async () => {
              await translations.refetch();
              await onChanged();
            }}
          />
        )}
      </AsyncBoundary>
    </div>
  );
}

// ---------- Editor ----------

interface TranslationEditorProps {
  apartmentId: number;
  lang: string;
  existing: ApartmentTranslationResponse | null;
  allTranslations: ApartmentTranslationResponse[];
  activeLang: string;
  onSelectLang: (lang: string) => void;
  onSaved: () => void | Promise<void>;
}

function TranslationEditor({
  apartmentId,
  lang,
  existing,
  allTranslations,
  activeLang,
  onSelectLang,
  onSaved,
}: TranslationEditorProps) {
  const confirm = useConfirm();
  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");

  // Kad korisnik prebaci jezik, napuni polja tim prijevodom
  useEffect(() => {
    setName(existing?.name ?? "");
    setDescription(existing?.description ?? "");
  }, [existing, lang]);

  const save = useMutation(
    async () => {
      await upsertApartmentTranslation(apartmentId, lang, {
        languageCode: lang,
        name: name.trim(),
        description: description.trim(),
      });
    },
    { onSuccess: () => void onSaved() }
  );

  const remove = useMutation(
    async () => {
      await deleteApartmentTranslation(apartmentId, lang);
    },
    { onSuccess: () => void onSaved() }
  );

  const existingCodes = new Set(allTranslations.map((t) => t.languageCode));
  const missing = SUPPORTED_LANGUAGES.filter((l) => !existingCodes.has(l.code));

  const isDirty =
    name !== (existing?.name ?? "") ||
    description !== (existing?.description ?? "");

  const canSave = name.trim().length > 0 && description.trim().length > 0;

  return (
    <div className="space-y-4">
      {/* Upozorenje o jezicima koji nedostaju */}
      {missing.length > 0 && (
        <div className="flex gap-2.5 rounded-xl border border-amber-500/30 bg-amber-50 px-4 py-3 dark:border-amber-500/25 dark:bg-amber-950/20">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-xs text-amber-800 text-pretty dark:text-amber-300">
            Nedostaju prijevodi:{" "}
            <strong>{missing.map((l) => l.label).join(", ")}</strong>. Posjetitelji
            koji koriste te jezike vidjet će fallback jezik. Backend nema
            auto-prijevod — svaki jezik se unosi ručno.
          </p>
        </div>
      )}

      {/* Odabir jezika */}
      <div className="scrollbar-none -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {SUPPORTED_LANGUAGES.map((language) => {
          const exists = existingCodes.has(language.code);
          const isActive = language.code === activeLang;

          return (
            <button
              key={language.code}
              type="button"
              onClick={() => onSelectLang(language.code)}
              className={cn(
                "inline-flex min-h-[2.5rem] shrink-0 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="font-mono text-xs uppercase">
                {language.code}
              </span>
              {language.label}
              {exists ? (
                <Check
                  className={cn(
                    "h-3.5 w-3.5",
                    isActive ? "opacity-80" : "text-emerald-600"
                  )}
                />
              ) : (
                <Plus
                  className={cn(
                    "h-3.5 w-3.5",
                    isActive ? "opacity-60" : "text-muted-foreground/50"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {(save.error ?? remove.error) != null && (
        <ErrorState
          error={save.error ?? remove.error}
          context={`Prijevod (${lang.toUpperCase()})`}
          compact
        />
      )}

      {/* Forma */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <div className="space-y-2">
          <label
            htmlFor={`name-${lang}`}
            className="text-sm font-medium text-foreground"
          >
            Naziv apartmana{" "}
            <span className="font-mono text-xs text-muted-foreground">
              ({lang.toUpperCase()})
            </span>
          </label>
          <input
            id={`name-${lang}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="npr. Apartman Oliva"
            className="min-h-[3rem] w-full rounded-xl border border-input bg-background px-3.5 transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40 sm:min-h-[2.5rem]"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`desc-${lang}`}
            className="text-sm font-medium text-foreground"
          >
            Opis
          </label>
          <textarea
            id={`desc-${lang}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="Opis apartmana koji se prikazuje na javnoj stranici..."
            className="w-full rounded-xl border border-input bg-background px-3.5 py-3 leading-relaxed transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <p className="text-xs text-muted-foreground">
            {description.length} znakova
          </p>
        </div>

        <div className="flex flex-col gap-2 xs:flex-row">
          <button
            type="button"
            onClick={() => void save.run()}
            disabled={!canSave || save.isPending || !isDirty}
            className="inline-flex min-h-[2.75rem] flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          >
            {save.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {existing ? "Spremi izmjene" : "Dodaj prijevod"}
          </button>

          {existing && (
            <button
              type="button"
              onClick={async () => {
                const ok = await confirm({
                  title: `Obrisati ${lang.toUpperCase()} prijevod?`,
                  description:
                    "Posjetitelji koji koriste taj jezik vidjet će fallback jezik.",
                  confirmLabel: "Obriši prijevod",
                  variant: "destructive",
                });
                if (ok) void remove.run();
              }}
              disabled={remove.isPending}
              className="inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 active:scale-[0.98] disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Obriši
            </button>
          )}
        </div>

        {!canSave && (name.length > 0 || description.length > 0) && (
          <p className="text-xs text-muted-foreground">
            Naziv i opis su obavezni za spremanje prijevoda.
          </p>
        )}
      </div>
    </div>
  );
}
