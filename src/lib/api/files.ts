// ============================================================
// Files — §15 iz API-REFERENCE.md
//
// Backend vraća putanje tipa "/files/apartments/1/photo.jpg".
// One su relativne na backend host, a NE na Next.js host, pa ih
// treba prefiksirati s NEXT_PUBLIC_API_URL prije prikaza.
//
// /files/**            → javno, obična <img src> radi
// /api/admin/files/**  → traži JWT header, <img src> NE radi
//                        (te slike su GDPR-osjetljive, ne koriste
//                        se za apartmane nego za checkin dokumente)
// ============================================================

import { apiBaseUrl } from "@/lib/api/base-url";

/**
 * Pretvara putanju iz backenda u punu URL adresu za <img src>.
 * Vraća null za prazan ulaz da se u JSX-u lako radi fallback.
 */
export function fileUrl(path: string | null | undefined): string | null {
  if (!path) return null;

  // Backend je već vratio apsolutni URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl()}${normalized}`;
}
