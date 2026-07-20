"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth/token-storage";
import { fileUrl } from "@/lib/api/files";

// ============================================================
// Dohvat GDPR-zaštićene slike.
//
// Slike dokumenata gostiju žive na /api/admin/files/** i traže
// Authorization header — običan <img src> dobije 401. Zato se
// slika dohvaća fetchom s JWT-om, pretvara u blob URL i tek onda
// daje <img> elementu. (§15 API reference izričito ovo traži.)
// ============================================================

interface ProtectedImageState {
  src: string | null;
  isLoading: boolean;
  error: boolean;
}

export function useProtectedImage(
  path: string | null | undefined
): ProtectedImageState {
  const [state, setState] = useState<ProtectedImageState>({
    src: null,
    isLoading: Boolean(path),
    error: false,
  });

  useEffect(() => {
    if (!path) {
      setState({ src: null, isLoading: false, error: false });
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    const load = async () => {
      setState({ src: null, isLoading: true, error: false });

      try {
        const url = fileUrl(path);
        if (!url) throw new Error("no url");

        const token = getAccessToken();
        const response = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const blob = await response.blob();
        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);
        setState({ src: objectUrl, isLoading: false, error: false });
      } catch {
        if (!cancelled) setState({ src: null, isLoading: false, error: true });
      }
    };

    void load();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path]);

  return state;
}
