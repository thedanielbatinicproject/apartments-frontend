"use client";

import { useState } from "react";
import { Plus, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CompanyCatalogs } from "@/lib/api/types";

// ============================================================
// Dropdown s vrijednostima iz Kataloga (§10).
//
// Zadnja opcija je "Dodaj novo" — upisana vrijednost se odmah
// sprema u katalog firme, pa je idući put već na popisu. Time
// katalog raste kroz normalan rad umjesto da ga netko mora
// unaprijed popuniti na drugom ekranu.
//
// Nativni <select> je namjeran: na mobitelu otvara sistemski
// kotačić koji je brži i pouzdaniji od bilo kakvog custom
// dropdowna, i radi s tipkovnicom bez dodatnog koda.
// ============================================================

const ADD_NEW = "__add_new__";

interface CatalogSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  /** Koja lista iz kataloga se koristi */
  catalogKey: keyof CompanyCatalogs;
  options: string[];
  /** Sprema novu vrijednost u katalog firme */
  onAddToCatalog: (catalogKey: keyof CompanyCatalogs, value: string) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CatalogSelect({
  id,
  value,
  onChange,
  catalogKey,
  options,
  onAddToCatalog,
  placeholder = "— odaberi —",
  disabled = false,
  className,
}: CatalogSelectProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const controlClass =
    "min-h-[3rem] w-full rounded-xl border border-input bg-background px-3.5 transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-50 sm:min-h-[2.5rem]";

  const confirmAdd = async () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    setIsSaving(true);
    try {
      // Odaberi odmah, pa spremi u katalog — ako spremanje padne,
      // vrijednost je i dalje na računu i unos nije izgubljen.
      onChange(trimmed);
      if (!options.includes(trimmed)) {
        await onAddToCatalog(catalogKey, trimmed);
      }
      setIsAdding(false);
      setDraft("");
    } finally {
      setIsSaving(false);
    }
  };

  if (isAdding) {
    return (
      <div className={cn("flex gap-2", className)}>
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void confirmAdd();
            }
            if (e.key === "Escape") {
              setIsAdding(false);
              setDraft("");
            }
          }}
          placeholder="Upiši novu vrijednost"
          disabled={isSaving}
          className={controlClass}
        />

        <button
          type="button"
          onClick={() => void confirmAdd()}
          disabled={!draft.trim() || isSaving}
          aria-label="Spremi"
          className="flex min-h-[3rem] w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all active:scale-95 disabled:opacity-40 sm:min-h-[2.5rem]"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsAdding(false);
            setDraft("");
          }}
          disabled={isSaving}
          aria-label="Odustani"
          className="flex min-h-[3rem] w-12 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors active:bg-muted sm:min-h-[2.5rem]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <select
      id={id}
      value={options.includes(value) ? value : value ? value : ""}
      disabled={disabled}
      onChange={(e) => {
        if (e.target.value === ADD_NEW) {
          setIsAdding(true);
          return;
        }
        onChange(e.target.value);
      }}
      className={cn(controlClass, className)}
    >
      <option value="">{placeholder}</option>

      {/* Vrijednost koja postoji na računu ali (još) nije u katalogu */}
      {value && !options.includes(value) && (
        <option value={value}>{value}</option>
      )}

      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}

      <option value={ADD_NEW}>+ Dodaj novo…</option>
    </select>
  );
}

/** Ikona za prazan katalog — koristi se u formi kao pomoć. */
export function EmptyCatalogHint({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Plus className="h-3 w-3 shrink-0" />
      Popis {label} je prazan — odaberite „Dodaj novo” pa se sprema za idući
      put.
    </p>
  );
}
