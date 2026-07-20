"use client";
// ============================================================
// Auth Context — globalni auth state za cijelu aplikaciju.
//
// Drži:
//   user       → AdminUserResponse | null (dohvaćeno s /api/admin/users/me)
//   isLoading  → true dok se inicijalizira (provjera refresh tokena)
//
// Inicijalizacija pri mount-u:
//   1. Provjeri postoji li refreshToken u localStorage
//   2. Ako da → pozovi /api/auth/refresh → spremi nove tokene → dohvati /me
//   3. Ako ne → user = null (nije prijavljen)
// ============================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getRefreshToken,
  storeTokens,
  clearAllTokens,
} from "@/lib/auth/token-storage";
import {
  loginWithEmail,
  loginWithGoogle,
  logout as apiLogout,
  getMe,
} from "@/lib/api/auth";
import type { AdminUserResponse } from "@/lib/api/types";

// --- Tipovi ---

interface AuthContextValue {
  user: AdminUserResponse | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  /**
   * Ponovno dohvaća /me i osvježava globalni user objekt.
   * Koristi se npr. nakon promjene solar pretplate, da se
   * sidebar/header i ostali potrošači odmah usklade.
   */
  refreshUser: () => Promise<void>;
}

// --- Context kreacija ---

const AuthContext = createContext<AuthContextValue | null>(null);

// --- Provider ---

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicijalizacija — pokušaj auto-login s postojećim refresh tokenom
  useEffect(() => {
    const init = async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Pokušaj refresh tokena
        const API_BASE = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${API_BASE}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          clearAllTokens();
          setIsLoading(false);
          return;
        }

        const json = await response.json();
        if (!json.success || !json.data) {
          clearAllTokens();
          setIsLoading(false);
          return;
        }

        storeTokens(json.data.accessToken, json.data.refreshToken);

        // Dohvati podatke o korisniku
        const me = await getMe();
        setUser(me);
      } catch {
        clearAllTokens();
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // --- Login email/lozinka ---
  const login = useCallback(async (email: string, password: string) => {
    const tokens = await loginWithEmail(email, password);
    storeTokens(tokens.accessToken, tokens.refreshToken);
    const me = await getMe();
    setUser(me);
  }, []);

  // --- Login Google ---
  const loginGoogle = useCallback(async (idToken: string) => {
    const tokens = await loginWithGoogle(idToken);
    storeTokens(tokens.accessToken, tokens.refreshToken);
    const me = await getMe();
    setUser(me);
  }, []);

  // --- Logout ---
  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await apiLogout(refreshToken);
      } catch {
        // Logout na serveru fail nije kritičan — lokalno čistimo svakako
      }
    }
    clearAllTokens();
    setUser(null);
  }, []);

  // --- Osvježavanje trenutnog korisnika ---
  const refreshUser = useCallback(async () => {
    const me = await getMe();
    setUser(me);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, loginGoogle, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// --- Hook ---

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth mora biti pozvan unutar <AuthProvider>.");
  }
  return ctx;
}
