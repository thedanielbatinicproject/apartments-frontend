// ============================================================
// API Klijent — centralni fetch wrapper za sve backend pozive.
//
// Funkcionalnosti:
//   1. Automatski dodaje Authorization: Bearer <accessToken>
//   2. Na 401 → refresh token → retry originalnog zahtjeva
//   3. Ako refresh failira → clearAllTokens + redirect na /intranet/login
//   4. Parsira ApiResponse<T> i vraća samo .data (ili baca ApiError)
// ============================================================

import {
  getAccessToken,
  getRefreshToken,
  storeTokens,
  clearAllTokens,
} from "@/lib/auth/token-storage";
import { ApiError, type ApiResponse } from "@/lib/api/types";

import { apiBaseUrl } from "@/lib/api/base-url";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL nije definiran. Provjeri .env.local datoteku."
  );
}

// Prati je li refresh već u tijeku (sprječava višestruke refresh pozive)
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function notifySubscribers(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("Nema refresh tokena.");

  const response = await fetch(`${apiBaseUrl()}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearAllTokens();
    window.location.href = "/intranet/login";
    throw new Error("Refresh token istekao. Molimo prijavite se ponovo.");
  }

  const json: ApiResponse<{ accessToken: string; refreshToken: string }> =
    await response.json();

  if (!json.success || !json.data) {
    clearAllTokens();
    window.location.href = "/intranet/login";
    throw new Error("Refresh neuspješan.");
  }

  storeTokens(json.data.accessToken, json.data.refreshToken);
  return json.data.accessToken;
}

// --- Generična fetch funkcija ---

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: Record<string, unknown> | FormData;
  params?: Record<string, string | number | boolean | undefined | null>;
  skipAuth?: boolean; // Za javne rute (login, register...)
  rawResponse?: boolean; // Za PDF i binarni sadržaj
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, params, skipAuth = false, rawResponse = false, ...fetchOptions } = options;

  // Gradi URL s query parametrima
  const url = new URL(`${apiBaseUrl()}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  // Gradi headere
  const headers: Record<string, string> = {};

  if (!skipAuth) {
    const accessToken = getAccessToken();
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  // Body handling
  let finalBody: BodyInit | undefined;
  if (body instanceof FormData) {
    finalBody = body;
    // Ne postavljamo Content-Type — browser ga sam postavi s boundary
  } else if (body) {
    headers["Content-Type"] = "application/json";
    finalBody = JSON.stringify(body);
  }

  const doFetch = async (token?: string): Promise<Response> => {
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(url.toString(), {
      ...fetchOptions,
      headers,
      body: finalBody,
    });
  };

  let response = await doFetch();

  // --- 401 handling: refresh i retry ---
  if (response.status === 401 && !skipAuth) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        notifySubscribers(newToken);
        response = await doFetch(newToken);
      } catch {
        isRefreshing = false;
        throw new ApiError(401, "Sesija je istekla.");
      }
    } else {
      // Čeka dok refresh završi
      const newToken = await new Promise<string>((resolve) => {
        subscribeTokenRefresh(resolve);
      });
      response = await doFetch(newToken);
    }
  }

  // --- Binarni sadržaj (PDF) ---
  if (rawResponse) {
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP ${response.status}`);
    }
    return response as unknown as T;
  }

  // --- JSON odgovor ---
  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    throw new ApiError(
      response.status,
      json.message ?? `HTTP ${response.status}`,
      json as ApiResponse<null>
    );
  }

  return json.data as T;
}

// --- Convenience metode ---

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: Record<string, unknown>, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "POST", body }),

  put: <T>(path: string, body?: Record<string, unknown>, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "PUT", body }),

  patch: <T>(path: string, body?: Record<string, unknown>, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "PATCH", body }),

  delete: <T>(path: string, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "DELETE" }),

  postForm: <T>(path: string, formData: FormData, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "POST", body: formData }),

  getPdf: (path: string, options?: RequestOptions) =>
    apiRequest<Response>(path, { ...options, method: "GET", rawResponse: true }),
};
