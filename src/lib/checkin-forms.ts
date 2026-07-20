// ============================================================
// Papirnati obrasci za prijavu gostiju.
//
// PDF-ovi žive u /public/forms i imenuju se po shemi:
//   guest-form-{apartmentId}-{lang}.pdf
//
// Obrazac nosi oznaku tipa "EN-1" (jezik + apartman) uz gornji
// lijevi marker — po njoj backend pri skeniranju prepoznaje o
// kojem se apartmanu i jeziku radi.
// ============================================================

export interface FormApartment {
  id: number;
  name: string;
  description: string;
}

/**
 * Apartmani se ovdje navode ručno, a ne dohvaćaju s backenda:
 * popis mora odgovarati PDF datotekama koje stvarno postoje u
 * /public/forms, a to je stvar repozitorija, ne baze.
 */
export const FORM_APARTMENTS: FormApartment[] = [
  { id: 1, name: "Apartman s vrtom", description: "Obrazac s oznakom 1" },
  { id: 2, name: "Studio apartman", description: "Obrazac s oznakom 2" },
  { id: 3, name: "Soba", description: "Obrazac s oznakom 3" },
];

export interface FormLanguage {
  code: string;
  name: string;
  /** Emoji zastava radi brzog prepoznavanja */
  flag: string;
}

export const FORM_LANGUAGES: FormLanguage[] = [
  { code: "hr", name: "Hrvatski", flag: "🇭🇷" },
  { code: "en", name: "Engleski", flag: "🇬🇧" },
  { code: "de", name: "Njemački", flag: "🇩🇪" },
  { code: "it", name: "Talijanski", flag: "🇮🇹" },
  { code: "fr", name: "Francuski", flag: "🇫🇷" },
  { code: "ua", name: "Ukrajinski", flag: "🇺🇦" },
];

/** Putanja do PDF-a unutar /public. */
export function formPdfPath(apartmentId: number, lang: string): string {
  return `/forms/guest-form-${apartmentId}-${lang}.pdf`;
}

export function apartmentName(apartmentId: number): string {
  return (
    FORM_APARTMENTS.find((a) => a.id === apartmentId)?.name ??
    `Apartman ${apartmentId}`
  );
}

export function languageName(code: string): string {
  return FORM_LANGUAGES.find((l) => l.code === code)?.name ?? code;
}

/**
 * Provjerava postoji li PDF prije nego ponudimo ispis.
 *
 * Neki obrasci još nisu izrađeni (npr. za sobu), a bez provjere
 * bi korisnik otvorio prazan prozor za ispis i ne bi znao zašto.
 */
export async function formPdfExists(
  apartmentId: number,
  lang: string
): Promise<boolean> {
  try {
    const response = await fetch(formPdfPath(apartmentId, lang), {
      method: "HEAD",
    });
    return response.ok;
  } catch {
    return false;
  }
}
