// ============================================================
// Provjera potpunosti podataka firme.
//
// Zašto postoji: svaki dokument SNIMA podatke firme u sebe u
// trenutku izdavanja. Ako nedostaje OIB ili IBAN, dokument je
// izdan bez njih — i to se ne može popraviti naknadno, jer
// izmjena postavki ne dira već izdane dokumente.
//
// Zato se nedostaci moraju vidjeti PRIJE izdavanja, ne poslije.
// ============================================================

import type { CompanyResponse } from "@/lib/api/types";

export interface CompanyFieldCheck {
  key: string;
  label: string;
  /** Bez ovoga dokument nije upotrebljiv */
  required: boolean;
  filled: boolean;
  /** Gdje se pojavljuje na dokumentu */
  where: string;
}

export function checkCompanyCompleteness(
  company: CompanyResponse | null
): CompanyFieldCheck[] {
  const value = (v: string | null | undefined) =>
    typeof v === "string" && v.trim().length > 0;

  return [
    {
      key: "brandName",
      label: "Naziv firme",
      required: true,
      filled: value(company?.brandName),
      where: "zaglavlje dokumenta",
    },
    {
      key: "oib",
      label: "OIB",
      required: true,
      filled: value(company?.oib),
      where: "zaglavlje dokumenta",
    },
    {
      key: "address",
      label: "Adresa",
      required: true,
      filled: value(company?.address),
      where: "zaglavlje dokumenta",
    },
    {
      key: "city",
      label: "Grad",
      required: true,
      filled: value(company?.city),
      where: "zaglavlje dokumenta",
    },
    {
      key: "iban",
      label: "IBAN",
      required: true,
      filled: value(company?.iban),
      where: "podnožje — gost po tome plaća",
    },
    {
      key: "ownerName",
      label: "Ime vlasnika",
      required: false,
      filled: value(company?.ownerName),
      where: "zaglavlje dokumenta",
    },
    {
      key: "bankName",
      label: "Naziv banke",
      required: false,
      filled: value(company?.bankName),
      where: "podnožje dokumenta",
    },
    {
      key: "phone",
      label: "Telefon",
      required: false,
      filled: value(company?.phone),
      where: "zaglavlje dokumenta",
    },
    {
      key: "email",
      label: "Email",
      required: false,
      filled: value(company?.email),
      where: "zaglavlje dokumenta",
    },
    {
      key: "signatoryName",
      label: "Potpisnik",
      required: false,
      filled: value(company?.signatoryName),
      where: "potpis na dnu dokumenta",
    },
  ];
}

/** Obavezna polja koja nedostaju. */
export function missingRequiredFields(
  company: CompanyResponse | null
): CompanyFieldCheck[] {
  return checkCompanyCompleteness(company).filter(
    (field) => field.required && !field.filled
  );
}

/** Je li firma spremna za izdavanje dokumenata. */
export function isCompanyReadyForInvoicing(
  company: CompanyResponse | null
): boolean {
  return missingRequiredFields(company).length === 0;
}

/** Udio popunjenih polja, za prikaz napretka. */
export function completenessRatio(company: CompanyResponse | null): {
  filled: number;
  total: number;
} {
  const fields = checkCompanyCompleteness(company);
  return {
    filled: fields.filter((f) => f.filled).length,
    total: fields.length,
  };
}

/** Grubi format IBAN-a — upozorenje, ne blokada (strani IBAN-i variraju). */
export function looksLikeValidIban(iban: string): boolean {
  const normalized = iban.replace(/\s+/g, "").toUpperCase();
  return /^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(normalized);
}

/** Hrvatski OIB ima 11 znamenki. */
export function looksLikeValidOib(oib: string): boolean {
  return /^\d{11}$/.test(oib.trim());
}
