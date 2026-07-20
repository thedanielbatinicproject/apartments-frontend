"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { acceptInvite } from "@/lib/api/auth";
import { storeTokens } from "@/lib/auth/token-storage";
import { ApiError } from "@/lib/api/types";
import {
  AuthInput,
  AuthSubmitButton,
  AuthTextButton,
  AuthError,
  AuthHeading,
} from "./AuthFormControls";

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
        <AuthHeading
          title="Nevažeći link"
          subtitle="Ovaj link za pozivnicu nije ispravan ili je istekao."
        />
        <AuthTextButton onClick={() => router.push("/intranet/login")}>
          ← Natrag na prijavu
        </AuthTextButton>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <AuthHeading
        title="Prihvati pozivnicu"
        subtitle="Postavite vaše ime i lozinku kako biste aktivirali admin račun."
      />

      {error && <AuthError message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="full-name"
          label="Puno ime i prezime"
          type="text"
          autoComplete="name"
          autoCapitalize="words"
          required
          disabled={isLoading}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ime Prezime"
        />

        <AuthInput
          id="invite-password"
          label="Lozinka"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          disabled={isLoading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Najmanje 6 znakova"
        />

        <AuthInput
          id="invite-confirm"
          label="Potvrdi lozinku"
          type="password"
          autoComplete="new-password"
          required
          disabled={isLoading}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Ponovi lozinku"
        />

        <AuthSubmitButton
          type="submit"
          loading={isLoading}
          loadingText="Aktivacija u tijeku..."
        >
          Aktiviraj račun
        </AuthSubmitButton>
      </form>
    </div>
  );
}
