"use client";

// ============================================================
// Unos UID koda računa (format XXXX-XXXX, hex: 0-9 A-F).
//
// NAMJERNO ugrađena tipkovnica uređaja (ne custom on-screen
// keypad) — samo prilagođena preko standardnih HTML/browser
// atributa da bude što bliža idealnoj, uz podršku na iOS-u,
// Androidu i desktopu:
//   - autoCapitalize="characters" — mobilne tipkovnice same
//     nude velika slova (UID je uvijek velikim slovima, backend
//     generira samo 0-9A-F).
//   - autoCorrect/autoComplete/spellCheck isključeni — kod nije
//     riječ, automatska ispravka/prijedlozi samo smetaju.
//   - Svaki unos se filtrira na hex znakove i prisilno uveliča
//     (radi i ako korisnik nekim uređajem ipak upiše malo slovo).
//   - Crtica se automatski umeće nakon 4. znaka — korisnik samo
//     tipka 8 znakova redom, format XXXX-XXXX je uvijek ispravan.
// ============================================================

const HEX_STRIP = /[^0-9A-F]/g;

/** "E7105" → "E710-5"; "E710" → "E710" (crtica tek nakon 4. znaka) */
function formatWithDash(raw: string): string {
  if (raw.length <= 4) return raw;
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
}

interface UidCodeInputProps {
  /** Sirovi hex znakovi BEZ crtice, max 8 znakova */
  value: string;
  onChange: (rawValue: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  id?: string;
  "aria-label"?: string;
}

export function UidCodeInput({
  value,
  onChange,
  placeholder,
  disabled,
  autoFocus,
  id,
  "aria-label": ariaLabel,
}: UidCodeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.toUpperCase().replace(HEX_STRIP, "").slice(0, 8);
    onChange(cleaned);
  };

  return (
    <input
      id={id}
      type="text"
      inputMode="text"
      autoCapitalize="characters"
      autoCorrect="off"
      autoComplete="off"
      spellCheck={false}
      autoFocus={autoFocus}
      disabled={disabled}
      value={formatWithDash(value)}
      onChange={handleChange}
      placeholder={placeholder}
      maxLength={9}
      aria-label={ariaLabel}
      className="w-full rounded-2xl border-2 border-stone-700 bg-stone-900/70 px-4 py-5 text-center font-mono text-3xl font-bold tracking-[0.3em] text-stone-100 placeholder:tracking-normal placeholder:text-base placeholder:font-normal placeholder:text-stone-600 transition-colors focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/30 disabled:opacity-60"
    />
  );
}
