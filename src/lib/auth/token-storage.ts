// ============================================================
// Token Storage — enkapsulira sve čitanje/pisanje tokena.
//
// Strategija:
//   accessToken  → sessionStorage (nestaje kad se tab zatvori, XSS-safer)
//   refreshToken → localStorage (preživljava reload, ali ne i logout)
//
// Middleware (server-side) koristi httpOnly cookie za inizijalni
// auth check — taj cookie se postavlja ovdje pri svakom loginu.
// ============================================================

import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "apsi_access";
const REFRESH_TOKEN_KEY = "apsi_refresh";

// Cookie koji čita Next.js middleware (samo ime tokena, ne vrijednost —
// middleware provjerava samo prisutnost tokena, ne validira ga)
const AUTH_COOKIE_NAME = "apsi_auth";

// --- Access Token (sessionStorage) ---

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}

// --- Refresh Token (localStorage) ---

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
  // Postavi i cookie za middleware (bez vrijednosti — samo signal prisutnosti)
  Cookies.set(AUTH_COOKIE_NAME, "1", {
    sameSite: "strict",
    // secure: true — uključi u produkciji (HTTPS)
  });
}

export function clearRefreshToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  Cookies.remove(AUTH_COOKIE_NAME);
}

// --- Kombinirane akcije ---

export function storeTokens(accessToken: string, refreshToken: string): void {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
}

export function clearAllTokens(): void {
  clearAccessToken();
  clearRefreshToken();
}
