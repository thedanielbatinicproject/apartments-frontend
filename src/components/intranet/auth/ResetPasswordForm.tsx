"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/types";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Lozinka mora imati najmanje 8 znakova.");
      return;
    }
    if (password !== confirm) {
      setError("Lozinke se ne podudaraju.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400) setError("Token je nevažeći ili istekao.");
        else setError(err.message ?? "Greška. Pokušajte ponovo.");
      } else {
        setError("Greška. Pokušajte ponovo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Nevažeći link
        </h1>
        <p className="text-sm text-muted-foreground">
          Ovaj reset link nije ispravan. Molimo zatražite novi.
        </p>
        <button
          type="button"
          onClick={() => router.push("/intranet/login")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
        >
          ← Natrag na prijavu
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="w-full space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Lozinka promijenjena!
          </h1>
          <p className="text-sm text-muted-foreground">
            Vaša lozinka je uspješno promijenjena. Sada se možete prijaviti.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/intranet/login")}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all"
        >
          Prijavi se
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Nova lozinka
        </h1>
        <p className="text-sm text-muted-foreground">
          Odaberite novu lozinku za vaš račun.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="new-password" className="text-sm font-medium text-foreground">
            Nova lozinka
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Najmanje 8 znakova"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
            Potvrdi novu lozinku
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            disabled={isLoading}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Ponovi lozinku"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60 transition-all"
        >
          {isLoading ? "Sprema se..." : "Postavi novu lozinku"}
        </button>
      </form>
    </div>
  );
}
