"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/types";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message ?? "Greška. Pokušajte ponovo.");
      } else {
        setError("Greška. Pokušajte ponovo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Provjerite email
          </h1>
          <p className="text-sm text-muted-foreground">
            Ako račun s adresom <strong>{email}</strong> postoji, poslali smo
            link za resetiranje lozinke.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          Ne vidite email? Provjerite spam mapu ili pričekajte par minuta.
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
        >
          ← Natrag na prijavu
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Zaboravljena lozinka
        </h1>
        <p className="text-sm text-muted-foreground">
          Unesite email adresu vašeg računa i poslat ćemo vam link za
          resetiranje.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="reset-email" className="text-sm font-medium text-foreground">
            Email adresa
          </label>
          <input
            id="reset-email"
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60 transition-all"
        >
          {isLoading ? "Slanje..." : "Pošalji reset link"}
        </button>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
      >
        ← Natrag na prijavu
      </button>
    </div>
  );
}
