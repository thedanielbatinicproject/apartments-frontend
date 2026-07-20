"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Loader2,
  Building2,
  Landmark,
  Receipt,
  ListChecks,
  AlertTriangle,
  ArrowRightLeft,
  ExternalLink,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync, useMutation } from "@/hooks/use-async";
import { useCompany } from "@/lib/company/company-context";
import { getCompany, updateCompany } from "@/lib/api/companies";
import type { CompanyResponse, CompanyUpdateRequest } from "@/lib/api/types";
import {
  missingRequiredFields,
  completenessRatio,
  looksLikeValidIban,
  looksLikeValidOib,
} from "@/lib/company-utils";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/intranet/ui/DataStates";
import { CompanyLogoSection } from "@/components/intranet/settings/CompanyLogoSection";

// ============================================================
// /intranet/settings — Postavke firme.
//
// Sve na ovoj stranici završi na PDF dokumentima. Zato je na
// vrhu upozorenje o nedostajućim podacima: dokument se izdaje s
// podacima kakvi su u tom trenutku, a naknadna izmjena ovdje NE
// mijenja već izdane dokumente.
//
// Jedno spremanje za cijelu stranicu — roditelji ne trebaju
// pamtiti koji gumb sprema koju sekciju. Iznimka je logo, koji
// ide zasebnom rutom i djeluje odmah.
// ============================================================

export default function SettingsPage() {
  const {
    selectedCompany,
    selectedCompanyId,
    isLoading: isCompanyLoading,
    reload: reloadCompanies,
  } = useCompany();

  const company = useAsync<CompanyResponse>(
    () => getCompany(selectedCompanyId as number),
    [selectedCompanyId],
    { enabled: selectedCompanyId != null }
  );

  // --- Polja ---
  const [form, setForm] = useState<CompanyUpdateRequest>({ brandName: "" });
  const [isDirty, setIsDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // Napuni formu kad podaci stignu
  useEffect(() => {
    const data = company.data;
    if (!data) return;

    setForm({
      brandName: data.brandName ?? "",
      ownerName: data.ownerName ?? "",
      oib: data.oib ?? "",
      address: data.address ?? "",
      city: data.city ?? "",
      postalCode: data.postalCode ?? "",
      country: data.country ?? "",
      phone: data.phone ?? "",
      email: data.email ?? "",
      bankName: data.bankName ?? "",
      iban: data.iban ?? "",
      swift: data.swift ?? "",
      currency: data.currency ?? "EUR",
      taxRate: data.taxRate ?? 0,
      vatExemptNoteHr: data.vatExemptNoteHr ?? "",
      vatExemptNoteEn: data.vatExemptNoteEn ?? "",
      touristTaxNoteHr: data.touristTaxNoteHr ?? "",
      touristTaxNoteEn: data.touristTaxNoteEn ?? "",
      signatoryName: data.signatoryName ?? "",
    });
    setIsDirty(false);
  }, [company.data]);

  const set = <K extends keyof CompanyUpdateRequest>(
    key: K,
    value: CompanyUpdateRequest[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
    setSavedAt(null);
  };

  const save = useMutation(
    async () => {
      const payload: CompanyUpdateRequest = {
        ...form,
        brandName: (form.brandName ?? "").trim(),
      };
      return updateCompany(selectedCompanyId as number, payload);
    },
    {
      onSuccess: async () => {
        setIsDirty(false);
        setSavedAt(Date.now());
        await company.refetch();
        // Prekidač firme u zaglavlju prikazuje brandName
        await reloadCompanies();
      },
    }
  );

  if (isCompanyLoading || (selectedCompanyId != null && company.isInitialLoading)) {
    return <LoadingState label="Učitavanje postavki..." />;
  }

  if (selectedCompanyId == null) {
    return (
      <EmptyState
        icon={Building}
        title="Nema definiranih firmi"
        description="Postavke se odnose na firmu, pa je barem jedna potrebna."
      />
    );
  }

  if (company.error && !company.data) {
    return (
      <ErrorState
        error={company.error}
        onRetry={() => void company.refetch()}
        context="Dohvat podataka firme"
      />
    );
  }

  const missing = missingRequiredFields(company.data);
  const ratio = completenessRatio(company.data);

  const oibValue = (form.oib ?? "").trim();
  const ibanValue = (form.iban ?? "").trim();

  const canSave = (form.brandName ?? "").trim().length > 0;

  const inputClass =
    "min-h-[3rem] w-full rounded-xl border border-input bg-background px-3.5 transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40 sm:min-h-[2.5rem]";
  const labelClass = "text-sm font-medium text-foreground";
  const sectionClass = "space-y-4 rounded-2xl border border-border bg-card p-4";

  return (
    <div className="space-y-4 pb-24 sm:pb-6">
      {/* Zaglavlje */}
      <div>
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          Postavke
        </h2>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-sm text-muted-foreground">
          <span className="truncate font-medium text-foreground">
            {selectedCompany?.brandName}
          </span>
          <span className="inline-flex items-center gap-1 text-xs">
            <ArrowRightLeft className="h-3 w-3" />
            promjena firme gore desno
          </span>
        </p>
      </div>

      {/* Upozorenje o nedostajućim podacima */}
      {missing.length > 0 ? (
        <div className="flex gap-2.5 rounded-xl border border-amber-500/30 bg-amber-50 px-4 py-3 dark:border-amber-500/25 dark:bg-amber-950/20">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div className="min-w-0 text-xs text-amber-800 dark:text-amber-300">
            <p className="font-semibold">
              Nedostaje {missing.length}{" "}
              {missing.length === 1 ? "podatak" : "podataka"} za ispravan račun
            </p>
            <p className="mt-1 text-pretty">
              {missing.map((f) => f.label).join(", ")}. Dokumenti izdani bez
              toga ostaju takvi zauvijek — kasnija izmjena ovdje ne mijenja već
              izdane račune.
            </p>
          </div>
        </div>
      ) : (
        <p className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400">
          <Check className="h-3.5 w-3.5 shrink-0" />
          Podaci su potpuni ({ratio.filled}/{ratio.total} polja popunjeno).
        </p>
      )}

      {save.error != null && (
        <ErrorState error={save.error} context="Spremanje postavki" compact />
      )}

      {/* --- Podaci firme --- */}
      <section className={sectionClass}>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          Podaci firme
        </h3>
        <p className="text-xs text-muted-foreground">
          Ispisuju se u zaglavlju svakog dokumenta.
        </p>

        <div className="space-y-2">
          <label htmlFor="brandName" className={labelClass}>
            Naziv firme <span className="text-destructive">*</span>
          </label>
          <input
            id="brandName"
            value={form.brandName ?? ""}
            onChange={(e) => set("brandName", e.target.value)}
            placeholder="npr. Apartmani Brigita"
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="ownerName" className={labelClass}>
            Ime i prezime vlasnika
          </label>
          <input
            id="ownerName"
            value={form.ownerName ?? ""}
            onChange={(e) => set("ownerName", e.target.value)}
            autoCapitalize="words"
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="oib" className={labelClass}>
            OIB <span className="text-destructive">*</span>
          </label>
          <input
            id="oib"
            inputMode="numeric"
            value={oibValue}
            onChange={(e) => set("oib", e.target.value)}
            placeholder="11 znamenki"
            className={cn(inputClass, "font-mono")}
          />
          {oibValue.length > 0 && !looksLikeValidOib(oibValue) && (
            <p className="text-xs text-amber-600">
              OIB ima točno 11 znamenki.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className={labelClass}>
            Adresa <span className="text-destructive">*</span>
          </label>
          <input
            id="address"
            value={form.address ?? ""}
            onChange={(e) => set("address", e.target.value)}
            placeholder="Ulica i kućni broj"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-2">
            <label htmlFor="postalCode" className={labelClass}>
              Pošta
            </label>
            <input
              id="postalCode"
              inputMode="numeric"
              value={form.postalCode ?? ""}
              onChange={(e) => set("postalCode", e.target.value)}
              placeholder="22000"
              className={inputClass}
            />
          </div>

          <div className="col-span-2 space-y-2">
            <label htmlFor="city" className={labelClass}>
              Grad <span className="text-destructive">*</span>
            </label>
            <input
              id="city"
              value={form.city ?? ""}
              onChange={(e) => set("city", e.target.value)}
              placeholder="Šibenik"
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="country" className={labelClass}>
            Država
          </label>
          <input
            id="country"
            value={form.country ?? ""}
            onChange={(e) => set("country", e.target.value)}
            placeholder="Hrvatska"
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className={labelClass}>
            Telefon
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            value={form.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+385 91 234 5678"
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={form.email ?? ""}
            onChange={(e) => set("email", e.target.value)}
            className={inputClass}
          />
        </div>
      </section>

      {/* --- Logo --- */}
      <CompanyLogoSection
        companyId={selectedCompanyId}
        logoUrl={company.data?.logoUrl ?? null}
        onUploaded={() => void company.refetch()}
      />

      {/* --- Bankovni podaci --- */}
      <section className={sectionClass}>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Landmark className="h-4 w-4 text-muted-foreground" />
          Bankovni podaci
        </h3>
        <p className="text-xs text-muted-foreground text-pretty">
          Gost po ovome plaća — ispisuje se u podnožju dokumenta.
        </p>

        <div className="space-y-2">
          <label htmlFor="iban" className={labelClass}>
            IBAN <span className="text-destructive">*</span>
          </label>
          <input
            id="iban"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            value={ibanValue}
            onChange={(e) => set("iban", e.target.value.toUpperCase())}
            placeholder="HR1210010051863000160"
            className={cn(inputClass, "font-mono")}
          />
          {ibanValue.length > 0 && !looksLikeValidIban(ibanValue) && (
            <p className="text-xs text-amber-600">
              Provjerite IBAN — očekuje se oblik poput HR12 1001 0051 8630 0016 0.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="bankName" className={labelClass}>
            Naziv banke
          </label>
          <input
            id="bankName"
            value={form.bankName ?? ""}
            onChange={(e) => set("bankName", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label htmlFor="swift" className={labelClass}>
              SWIFT / BIC
            </label>
            <input
              id="swift"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              value={form.swift ?? ""}
              onChange={(e) => set("swift", e.target.value.toUpperCase())}
              className={cn(inputClass, "font-mono")}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="currency" className={labelClass}>
              Valuta
            </label>
            <select
              id="currency"
              value={form.currency ?? "EUR"}
              onChange={(e) => set("currency", e.target.value)}
              className={inputClass}
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="CHF">CHF</option>
            </select>
          </div>
        </div>
      </section>

      {/* --- Porez i napomene --- */}
      <section className={sectionClass}>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Receipt className="h-4 w-4 text-muted-foreground" />
          Porez i napomene
        </h3>

        <div className="space-y-2">
          <label htmlFor="taxRate" className={labelClass}>
            Porezna stopa (%)
          </label>
          <input
            id="taxRate"
            type="number"
            inputMode="decimal"
            step="any"
            min={0}
            max={100}
            value={form.taxRate ?? 0}
            onChange={(e) => {
              const parsed = Number(e.target.value.replace(",", "."));
              set("taxRate", Number.isFinite(parsed) ? parsed : 0);
            }}
            className={inputClass}
          />
          <p className="text-xs text-muted-foreground text-pretty">
            Za paušalni obrt izvan sustava PDV-a ostavite <strong>0</strong>. Na
            dokumentu se tada umjesto poreza ispisuje napomena ispod.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="vatExemptNoteHr" className={labelClass}>
            Napomena o PDV-u (hrvatski)
          </label>
          <textarea
            id="vatExemptNoteHr"
            rows={2}
            value={form.vatExemptNoteHr ?? ""}
            onChange={(e) => set("vatExemptNoteHr", e.target.value)}
            placeholder="PDV nije obračunat temeljem čl. 90. Zakona o PDV-u."
            className="w-full rounded-xl border border-input bg-background px-3.5 py-3 leading-relaxed transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="vatExemptNoteEn" className={labelClass}>
            Napomena o PDV-u (engleski)
          </label>
          <textarea
            id="vatExemptNoteEn"
            rows={2}
            value={form.vatExemptNoteEn ?? ""}
            onChange={(e) => set("vatExemptNoteEn", e.target.value)}
            placeholder="VAT not charged under Art. 90 of the Croatian VAT Act."
            className="w-full rounded-xl border border-input bg-background px-3.5 py-3 leading-relaxed transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <p className="text-xs text-muted-foreground">
            Strani gosti dobivaju englesku verziju.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="touristTaxNoteHr" className={labelClass}>
            Napomena o boravišnoj pristojbi (hrvatski)
          </label>
          <textarea
            id="touristTaxNoteHr"
            rows={2}
            value={form.touristTaxNoteHr ?? ""}
            onChange={(e) => set("touristTaxNoteHr", e.target.value)}
            placeholder="Boravišna pristojba je uključena u cijenu."
            className="w-full rounded-xl border border-input bg-background px-3.5 py-3 leading-relaxed transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="touristTaxNoteEn" className={labelClass}>
            Napomena o boravišnoj pristojbi (engleski)
          </label>
          <textarea
            id="touristTaxNoteEn"
            rows={2}
            value={form.touristTaxNoteEn ?? ""}
            onChange={(e) => set("touristTaxNoteEn", e.target.value)}
            placeholder="Tourist tax is included in the price."
            className="w-full rounded-xl border border-input bg-background px-3.5 py-3 leading-relaxed transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="signatoryName" className={labelClass}>
            Potpisnik dokumenta
          </label>
          <input
            id="signatoryName"
            value={form.signatoryName ?? ""}
            onChange={(e) => set("signatoryName", e.target.value)}
            autoCapitalize="words"
            placeholder="Ime koje stoji uz potpis"
            className={inputClass}
          />
        </div>
      </section>

      {/* --- Katalozi (žive u Računima) --- */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground">Katalozi</h3>
            <p className="mt-0.5 text-xs text-muted-foreground text-pretty">
              Opisi jedinica, vrste usluga i načini plaćanja uređuju se na
              stranici Računi, gdje se i koriste.
            </p>
            <Link
              href="/intranet/invoices"
              className="mt-2 inline-flex min-h-[2.5rem] items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Otvori Račune
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- Spremanje --- */}
      {/* Fiksirano na dnu na mobitelu: forma je duga, a gumb mora
          biti dohvatljiv bez skrolanja do kraja. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-gutter py-3 backdrop-blur-lg pb-safe-nav sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          {savedAt !== null && !isDirty && (
            <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <Check className="h-3.5 w-3.5" />
              Spremljeno
            </span>
          )}

          <button
            type="button"
            onClick={() => void save.run()}
            disabled={!canSave || !isDirty || save.isPending}
            className="inline-flex min-h-[3rem] flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.99] disabled:opacity-50 sm:min-h-[2.75rem]"
          >
            {save.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {isDirty ? "Spremi promjene" : "Sve je spremljeno"}
          </button>
        </div>
      </div>
    </div>
  );
}
