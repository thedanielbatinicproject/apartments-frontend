// ============================================================
// Zajednički tipovi koji odgovaraju backend ApiResponse<T> omotaču
// i svim shared DTO-ovima koji se koriste u više API modula.
// ============================================================

// --- Backend omotač odgovora ---
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
  timestamp: string;
}

// --- Auth ---
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AdminUserResponse {
  id: number;
  email: string;
  fullName: string;
  role: "ADMIN" | "SUPERADMIN";
  authProvider: "LOCAL" | "GOOGLE";
  enabled: boolean;
  solarReportSubscribed: boolean;
}

// --- Greške ---
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: ApiResponse<null>
  ) {
    super(message);
    this.name = "ApiError";
  }
}
