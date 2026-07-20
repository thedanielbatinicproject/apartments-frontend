import { redirect } from "next/navigation";

// ============================================================
// /accept-invite — preusmjeravanje na kanonsku stranicu.
//
// ZAŠTO POSTOJI:
// Backend u email pozivnici generira link oblika
//   http://localhost:3000/accept-invite?token=XXX
// a stranica s formom živi na /intranet/invite/accept (uz ostale
// auth stranice, unutar whitelist-e u proxy.ts).
//
// Bez ove rute korisnik dobije 404 i pozivnica je neupotrebljiva.
//
// Namjerno je rješeno redirectom, a NE premještanjem stranice:
// već poslani mailovi zauvijek nose staru putanju, pa i kad
// backend promijeni link, ovi stari linkovi moraju nastaviti
// raditi.
//
// Server komponenta → pravi HTTP redirect, bez bljeska prazne
// stranice koji bi nastao kod client-side preusmjeravanja.
// ============================================================

export default async function AcceptInviteRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  // Prosljeđujemo SVE query parametre, ne samo token — ako backend
  // ikad doda npr. ?email=, link i dalje radi bez izmjene ovdje.
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value);
    else if (Array.isArray(value) && value[0]) query.set(key, value[0]);
  }

  const queryString = query.toString();
  redirect(
    queryString
      ? `/intranet/invite/accept?${queryString}`
      : "/intranet/invite/accept"
  );
}
