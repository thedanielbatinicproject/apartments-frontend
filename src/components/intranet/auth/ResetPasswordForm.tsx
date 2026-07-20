"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/types";
import {
  AuthInput,
  AuthSubmitButton,
  AuthTextButton,
  AuthError,
  AuthHeading,
} from "./AuthFormControls";

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
        <AuthHeading
          title="Nevažeći link"
          subtitle="Ovaj reset link nije ispravan. Molimo zatražite novi."
        />
        <AuthTextButton onClick={() => router.push("/intranet/login")}>
          ← Natrag na prijavu
        </AuthTextButton>
      </div>
    );
  }

  if (done) {
    return (
      <div className="w-full space-y-6">
        <AuthHeading
          title="Lozinka promijenjena!"
          subtitle="Vaša lozinka je uspješno promijenjena. Sada se možete prijaviti."
        />
        <AuthSubmitButton
          type="button"
          onClick={() => router.push("/intranet/login")}
        >
          Prijavi se
        </AuthSubmitButton>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <AuthHeading
        title="Nova lozinka"
        subtitle="Odaberite novu lozinku za vaš račun."
      />

      {error && <AuthError message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="new-password"
          label="Nova lozinka"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          disabled={isLoading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Najmanje 8 znakova"
        />

        <AuthInput
          id="confirm-password"
          label="Potvrdi novu lozinku"
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
          loadingText="Sprema se..."
        >
          Postavi novu lozinku
        </AuthSubmitButton>
      </form>
    </div>
  );
}
