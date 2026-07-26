// ============================================================
// PRIVREMENO, samo za lokalni development. Kad je
// NEXT_PUBLIC_DEBUG_SAVE_SCANS=true, sprema kopiju slike koja se šalje
// backendu lokalno na disk (./debug-scans) preko /api/debug/save-scan
// (vidi ondje — ta ruta je i sama blokirana izvan developmenta, kao
// dodatna sigurnosna kočnica ako se ovaj flag slučajno zaboravi ugasiti).
//
// Fire-and-forget: greška ovdje NIKAD ne smije prekinuti stvarni upload
// prema pravom backendu.
// ============================================================

const ENABLED = process.env.NEXT_PUBLIC_DEBUG_SAVE_SCANS === "true";

export function debugSaveScan(blob: Blob, label: string): void {
  if (!ENABLED) return;

  const form = new FormData();
  form.append("image", blob, `${label}.jpg`);
  form.append("label", label);

  fetch("/api/debug/save-scan", { method: "POST", body: form }).catch(() => {
    // Tiho ignoriraj — ovo je samo pomagalo za testiranje.
  });
}
