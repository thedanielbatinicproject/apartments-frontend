// ============================================================
// Auth API — svi pozivi prema /api/auth/** endpointima.
// Sve rute su javne (skipAuth: true), osim logout-a koji šalje
// refresh token (ne treba access token, ali šalje ga svejedno).
// ============================================================

import { api } from "@/lib/api/client";
import type { TokenResponse, AdminUserResponse } from "@/lib/api/types";

// POST /api/auth/login
export async function loginWithEmail(
  email: string,
  password: string
): Promise<TokenResponse> {
  return api.post<TokenResponse>(
    "/api/auth/login",
    { email, password },
    { skipAuth: true }
  );
}

// POST /api/auth/google
export async function loginWithGoogle(idToken: string): Promise<TokenResponse> {
  return api.post<TokenResponse>(
    "/api/auth/google",
    { idToken },
    { skipAuth: true }
  );
}

// POST /api/auth/logout
export async function logout(refreshToken: string): Promise<void> {
  await api.post<null>(
    "/api/auth/logout",
    { refreshToken },
    { skipAuth: true }
  );
}

// POST /api/auth/forgot-password
export async function forgotPassword(email: string): Promise<void> {
  await api.post<null>(
    "/api/auth/forgot-password",
    { email },
    { skipAuth: true }
  );
}

// POST /api/auth/reset-password
export async function resetPassword(
  resetToken: string,
  newPassword: string
): Promise<void> {
  await api.post<null>(
    "/api/auth/reset-password",
    { resetToken, newPassword },
    { skipAuth: true }
  );
}

// POST /api/auth/invite/accept
export async function acceptInvite(
  inviteToken: string,
  fullName: string,
  password: string
): Promise<TokenResponse> {
  return api.post<TokenResponse>(
    "/api/auth/invite/accept",
    { inviteToken, fullName, password },
    { skipAuth: true }
  );
}

// GET /api/admin/users/me — dohvat trenutno prijavljenog korisnika
export async function getMe(): Promise<AdminUserResponse> {
  return api.get<AdminUserResponse>("/api/admin/users/me");
}
