"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/types";

interface LoginFormProps {
  onForgotPassword: () => void;
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const { login, loginGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/intranet/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      router.push(callbackUrl);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) setError("Neispravni email ili lozinka.");
        else if (err.status === 403) setError("Vaš račun je onemogućen.");
        else setError(err.message ?? "Greška pri prijavi. Pokušajte ponovo.");
      } else {
        setError("Greška pri prijavi. Pokušajte ponovo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setError(null);
    setIsLoading(true);
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google.");
      }
      await loginGoogle(credentialResponse.credential);
      router.push(callbackUrl);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message ?? "Google prijava neuspješna.");
      } else {
        setError("Google prijava neuspješna. Pokušajte ponovo.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Naslov */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dobrodošli natrag
        </h1>
        <p className="text-sm text-muted-foreground">
          Prijavite se u Apartments Šibenik intranet.
        </p>
      </div>

      {/* Error poruka */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Forma */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email adresa
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Lozinka
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Zaboravili ste lozinku?
            </button>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60 transition-all"
        >
          {isLoading ? "Prijava u tijeku..." : "Prijavi se"}
        </button>
      </form>

      {/* Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">ili</span>
        </div>
      </div>

      {/* Google gumb */}
      <div className="flex w-full justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google prijava otkazana ili neuspješna.")}
          useOneTap
          theme="outline"
          size="large"
          text="continue_with"
        />
      </div>
    </div>
  );
}
