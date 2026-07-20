// ============================================================
// Rukovanje PDF-om računa.
//
// PDF ruta traži `Authorization: Bearer ...`, pa se NE može
// otvoriti običnim <a href> ni window.open — browser na takav
// zahtjev ne šalje header. Zato PDF dohvaćamo fetchom kao blob
// pa dalje radimo s object URL-om.
//
// Mobilne posebnosti koje ovo rješava:
//  - window.open() nakon await-a popup blocker često blokira, jer
//    je izgubljena veza s korisnikovim klikom. Zato koristimo
//    <a download> koji nema to ograničenje.
//  - Web Share API omogućuje slanje računa gostu direktno u
//    WhatsApp/mail s telefona, bez preuzimanja pa traženja po
//    mapama. Dostupan je samo na HTTPS i ne na svim uređajima,
//    pa ga nudimo tek nakon provjere.
// ============================================================

/** Pretvara Response u blob i izvlači naziv datoteke iz headera. */
async function toPdfFile(
  response: Response,
  fallbackName: string
): Promise<{ blob: Blob; fileName: string }> {
  const blob = await response.blob();

  // Content-Disposition: inline; filename="racun-2026-001.pdf"
  const disposition = response.headers.get("Content-Disposition") ?? "";
  const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  const fileName = match?.[1]
    ? decodeURIComponent(match[1])
    : `${fallbackName}.pdf`;

  return { blob, fileName };
}

/**
 * Preuzima PDF na uređaj.
 * Radi pouzdano i na iOS-u i na Androidu jer koristi <a download>
 * umjesto window.open.
 */
export async function downloadPdf(
  response: Response,
  fallbackName: string
): Promise<void> {
  const { blob, fileName } = await toPdfFile(response, fallbackName);
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Oslobodi memoriju tek kad je preuzimanje sigurno krenulo
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/**
 * Otvara PDF u novoj kartici.
 *
 * NAPOMENA: neki mobilni browseri blokiraju otvaranje nove kartice
 * nakon async operacije. Ako se to dogodi, vraćamo false pa UI
 * može ponuditi preuzimanje kao rezervu.
 */
export async function openPdf(
  response: Response,
  fallbackName: string
): Promise<boolean> {
  const { blob } = await toPdfFile(response, fallbackName);
  const url = URL.createObjectURL(blob);

  const win = window.open(url, "_blank", "noopener,noreferrer");

  if (!win) {
    URL.revokeObjectURL(url);
    return false;
  }

  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return true;
}

/** Podržava li uređaj dijeljenje datoteka (Web Share API razina 2). */
export function canSharePdf(): boolean {
  if (typeof navigator === "undefined" || !navigator.canShare) return false;

  try {
    const probe = new File(["probe"], "probe.pdf", { type: "application/pdf" });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

/**
 * Dijeli PDF kroz nativni izbornik uređaja (WhatsApp, mail, ...).
 * Vraća false ako dijeljenje nije podržano ili ga je korisnik otkazao.
 */
export async function sharePdf(
  response: Response,
  fallbackName: string,
  title: string
): Promise<boolean> {
  if (!canSharePdf()) return false;

  const { blob, fileName } = await toPdfFile(response, fallbackName);
  const file = new File([blob], fileName, { type: "application/pdf" });

  try {
    await navigator.share({ files: [file], title });
    return true;
  } catch (err) {
    // AbortError = korisnik je zatvorio izbornik, nije greška
    if (err instanceof Error && err.name === "AbortError") return false;
    throw err;
  }
}
