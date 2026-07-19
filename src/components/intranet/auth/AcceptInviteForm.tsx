"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { acceptInvite } from "@/lib/api/auth";
import { storeTokens } from "@/lib/auth/token-storage";
import { ApiError } from "@/lib/api/types";

interface AcceptInviteFormProps {
  token: string;
}

export function AcceptInviteForm({ token }: AcceptInviteFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Lozinka mora imati najmanje 6 znakova.");
      return;
    }
    if (password !== confirm) {
      setError("Lozinke se ne podudaraju.");
      return;
    }

    setIsLoading(true);
    try {
      // Backend vraća TokenResponse — odmah smo prijavljeni
      const tokens = await acceptInvite(token, fullName, password);
      storeTokens(tokens.accessToken, tokens.refreshToken);
      // Redirect na dashboard — AuthProvider će dohvatiti /me
      router.replace("/intranet/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400)
          setError("Pozivnica je nevažeća, istekla je ili je već iskorištena.");
        else setError(err.message ?? "Greška. Pokušajte ponovo.");
      } else {
        setError("Greška. Pokušajte ponovo.");
      }
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
          Ovaj link za pozivnicu nije ispravan ili je istekao.
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

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Prihvati pozivnicu
        </h1>
        <p className="text-sm text-muted-foreground">
          Postavite vaše ime i lozinku kako biste aktivirali admin račun.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="full-name" className="text-sm font-medium text-foreground">
            Puno ime i prezime
          </label>
          <input
            id="full-name"
            type="text"
            autoComplete="name"
            required
            disabled={isLoading}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ime Prezime"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="invite-password" className="text-sm font-medium text-foreground">
            Lozinka
          </label>
          <input
            id="invite-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Najmanje 6 znakova"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="invite-confirm" className="text-sm font-medium text-foreground">
            Potvrdi lozinku
          </label>
          <input
            id="invite-confirm"
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
          {isLoading ? "Aktivacija u tijeku..." : "Aktiviraj račun"}
        </button>
      </form>
    </div>
  );
}
