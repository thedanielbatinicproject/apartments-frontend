// ============================================================
// Dekodiranje bitmaski za inverter/MPPT greške, upozorenja i
// "zastavicu strelice" (smjer toka energije).
//
// Izvor kodova: solar/solar_variables.json (privremena referenca
// koju je dao klijent — prepisano ovdje jer je backend/uređaj
// izvor istine za SAMO ZNAČENJE bitova, ne za shape odgovora).
//
// Svi kodovi (error_message_1/2, warning_message_1/2,
// charger_error_message, charger_warning_message) dolaze kao
// 16-bitni registri gdje svaki bit neovisno predstavlja jednu
// grešku/upozorenje (standard za ove MPPT/inverter kontrolere) —
// zato se dekodiraju kao BITMASKA (moguće je više aktivnih
// istovremeno), ne kao jedan odabran kôd. Vrijednost 0 = "nema
// aktivnih grešaka/upozorenja".
// ============================================================

export const INVERTER_ERRORS_1: Record<number, string> = {
  0: "Ventilator blokiran dok je inverter isključen",
  1: "Transformator invertera je pregrijan",
  2: "Napon baterije previsok za inverter",
  3: "Napon baterije prenizak za inverter",
  4: "Otkriven kratki spoj na izlazu invertera",
  5: "Izlazni napon invertera previsok",
  6: "Preopterećenje invertera predugo trajalo, isteklo vrijeme!",
  7: "Napon sabirnice invertera previsok",
  8: "Neuspjelo meko pokretanje sabirnice invertera",
  9: "Glavni relej invertera neispravan",
  10: "Greška senzora izlaznog napona invertera",
  11: "Greška senzora mrežnog napona invertera",
  12: "Greška senzora izlazne struje invertera",
  13: "Greška senzora mrežne struje invertera",
  14: "Greška senzora struje opterećenja invertera",
  15: "Greška prekomjerne mrežne struje invertera",
};

export const INVERTER_ERRORS_2: Record<number, string> = {
  0: "Radijator invertera pregrijan",
  1: "Greška klase napona baterije solarnog punjača",
  2: "Greška senzora struje solarnog punjača",
  3: "Struja solarnog punjača neukrotiva",
  4: "Napon mreže invertera prenizak",
  5: "Napon mreže invertera previsok",
  6: "Frekvencija mreže preniska",
  7: "Frekvencija mreže previsoka",
  8: "Greška zaštite od prekomjerne struje invertera",
  9: "Napon sabirnice invertera prenizak",
  10: "Neuspjelo meko pokretanje invertera",
  11: "Previsok DC napon na AC izlazu",
  12: "Veza baterije prekinuta",
  13: "Greška senzora kontrolne struje invertera",
  14: "Izlazni napon invertera prenizak",
};

export const INVERTER_WARNINGS_1: Record<number, string> = {
  0: "Ventilator blokiran dok je inverter uključen",
  1: "Ventilator 2 blokiran dok je inverter uključen",
  2: "Baterija prepunjena",
  3: "Niska razina baterije",
  4: "Preopterećenje invertera",
  5: "Smanjenje izlazne snage",
  6: "Solarni punjač zaustavljen zbog niske baterije",
  7: "Solarni punjač zaustavljen zbog previsokog PV napona",
  8: "Solarni punjač zaustavljen zbog preopterećenja",
  9: "Solarni punjač zaustavljen zbog pregrijavanja",
  10: "PV punjač zaustavljen zbog greške u komunikaciji",
};

/** Svi kodovi trenutno rezervirani — nema poznatih upozorenja. */
export const INVERTER_WARNINGS_2: Record<number, string> = {};

export const CHARGER_ERRORS: Record<number, string> = {
  0: "Greška hardverske zaštite punjača",
  1: "Prekomjerna struja u punjaču",
  2: "Greška senzora struje u punjaču",
  3: "Pregrijavanje u punjaču",
  4: "Napon ćelija previsok u punjaču",
  5: "Napon ćelija prenizak u punjaču",
  6: "Napon baterije previsok u punjaču",
  7: "Napon baterije prenizak u punjaču",
  8: "Struja neukrotiva u punjaču",
  9: "Greška parametara u punjaču",
};

export const CHARGER_WARNINGS: Record<number, string> = {
  0: "Greška ventilatora u punjaču",
};

/**
 * Dekodira bitmasku greške/upozorenja u popis TEKSTOVA aktivnih
 * stanja (može ih biti više istovremeno). Prazan niz = nema
 * aktivnih grešaka/upozorenja (uklj. slučaj value == null).
 */
export function decodeFaultBitmask(
  value: number | null | undefined,
  codes: Record<number, string>
): string[] {
  if (value == null || !Number.isFinite(value) || value === 0) return [];

  const active: string[] = [];
  for (const bitKey of Object.keys(codes)) {
    const bit = Number(bitKey);
    if ((value & (1 << bit)) !== 0) {
      active.push(codes[bit]);
    }
  }
  return active;
}

// ---------- Arrow flag (zastavica strelice invertera) ----------

interface ArrowFlagSegment {
  name: string;
  /** Bit gdje segment počinje (LSB = 0) */
  startBit: number;
  /** Broj bitova u segmentu (1 ili 2) */
  bitLength: number;
  /** Ključ je binarni zapis dobiven iz tih bitova (npr. "0"/"1" ili "00".."11") */
  values: Record<string, string>;
}

// Napomena o poretku bitova unutar 2-bitnih segmenata (6n7, 8n9):
// viši bit (7 odn. 9) je MSB dekodiranog binarnog stringa, niži
// (6 odn. 8) je LSB — najprirodnija/standardna konvencija kod
// čitanja "bitovi X i Y" s dva mjesta. Provjeriti sa stvarnim
// uređajem ako se dekodirano stanje čini pogrešno.
const ARROW_FLAG_SEGMENTS: ArrowFlagSegment[] = [
  {
    name: "Fotonaponske ćelije",
    startBit: 0,
    bitLength: 1,
    values: { "0": "Ne rade", "1": "U funkciji" },
  },
  {
    name: "Opterećenje",
    startBit: 1,
    bitLength: 1,
    values: { "0": "Isključeno", "1": "Uključeno" },
  },
  {
    name: "Baterija",
    startBit: 2,
    bitLength: 1,
    values: { "0": "Nije povezana", "1": "Povezana" },
  },
  {
    name: "Gradska mreža",
    startBit: 3,
    bitLength: 1,
    values: { "0": "Nije povezana", "1": "Povezana" },
  },
  {
    name: "Naponska ćelija prema opterećenju",
    startBit: 4,
    bitLength: 1,
    values: { "0": "Isključeno", "1": "Ćelija šalje snagu opterećenju" },
  },
  {
    name: "Stroj prema opterećenju",
    startBit: 5,
    bitLength: 1,
    values: { "0": "Isključeno", "1": "Stroj povezan s opterećenjem" },
  },
  {
    name: "Stroj prema bateriji",
    startBit: 6,
    bitLength: 2,
    values: {
      "00": "Isključeno",
      "01": "Stroj povezan s baterijom",
      "10": "Baterija povezana sa strojem",
      "11": "Povezano",
    },
  },
  {
    name: "Stroj prema gradskoj mreži",
    startBit: 8,
    bitLength: 2,
    values: {
      "00": "Isključeno",
      "01": "Stroj povezan s gradskom mrežom",
      "10": "Gradska mreža povezana sa strojem",
      "11": "Povezano",
    },
  },
];

export interface DecodedArrowSegment {
  name: string;
  /** Dekodirani tekst stanja za ovaj segment */
  value: string;
  /** Sirovi binarni zapis segmenta (npr. "1" ili "01") — za debug */
  raw: string;
}

/** Rastavlja inverterArrowFlag broj po segmentima iz uređaja. */
export function decodeArrowFlag(
  value: number | null | undefined
): DecodedArrowSegment[] {
  if (value == null || !Number.isFinite(value)) return [];

  return ARROW_FLAG_SEGMENTS.map((segment) => {
    const raw = (value >> segment.startBit) & ((1 << segment.bitLength) - 1);
    const rawStr = raw.toString(2).padStart(segment.bitLength, "0");
    return {
      name: segment.name,
      value: segment.values[rawStr] ?? `Nepoznato stanje (${rawStr})`,
      raw: rawStr,
    };
  });
}
