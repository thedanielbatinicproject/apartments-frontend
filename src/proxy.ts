// ============================================================
// Next.js Middleware — server-side zaštita /intranet/** ruta.
//
// Logika:
//   - Provjeri prisutnost "apsi_auth" cookie-ja (postavlja ga token-storage.ts)
//   - Rute koje ne trebaju auth (login, forgot-password, reset-password, invite/accept)
//     su eksplicitno isključene — dopuštaju pristup bez cookie-ja
//   - Svaka druga /intranet/** ruta bez cookie-ja → redirect na /intranet/login
//
// NAPOMENA: Middleware NE validira JWT token (to bi zahtijevalo
// kriptografsku biblioteku u edge runtime-u). On samo provjerava
// postoji li signal da korisnik ima aktivnu sesiju.
// Stvarna validacija se događa pri svakom API pozivu na backendu.
// ============================================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rute unutar /intranet koje su dostupne bez autentikacije
const PUBLIC_INTRANET_PATHS = [
  "/intranet/login",
  "/intranet/forgot-password",
  "/intranet/reset-password",
  "/intranet/invite/accept",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Provjeravamo samo /intranet rute
  if (!pathname.startsWith("/intranet")) {
    return NextResponse.next();
  }

  // Javne intranet rute — ne trebaju auth
  const isPublicIntranetPath = PUBLIC_INTRANET_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (isPublicIntranetPath) {
    return NextResponse.next();
  }

  // Privatne intranet rute — provjeri cookie
  const authCookie = request.cookies.get("apsi_auth");

  if (!authCookie) {
    // Spremi originalnu destinaciju za redirect nakon logina
    const loginUrl = new URL("/intranet/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Matcher: primijeni middleware na sve /intranet/** rute
  matcher: ["/intranet/:path*"],
};
