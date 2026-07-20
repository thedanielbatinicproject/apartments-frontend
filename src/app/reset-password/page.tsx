import { redirect } from "next/navigation";

// ============================================================
// /reset-password — preusmjeravanje na kanonsku stranicu.
//
// Isti razlog kao /accept-invite: email za resetiranje lozinke
// (POST /api/auth/forgot-password) generira link prema korijenu
// domene, a forma živi na /intranet/reset-password.
//
// Dodano preventivno — pozivnica je pokazala da backend gradi
// linkove prema korijenu, pa reset mail gotovo sigurno radi isto.
// Ako se ispostavi da backend već šalje ispravnu putanju, ova
// ruta jednostavno nikad neće biti pogođena i ništa ne šteti.
// ============================================================

export default async function ResetPasswordRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value);
    else if (Array.isArray(value) && value[0]) query.set(key, value[0]);
  }

  const queryString = query.toString();
  redirect(
    queryString
      ? `/intranet/reset-password?${queryString}`
      : "/intranet/reset-password"
  );
}
