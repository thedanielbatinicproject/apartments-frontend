"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/types";
import {
  AuthInput,
  AuthSubmitButton,
  AuthTextButton,
  AuthError,
  AuthHeading,
} from "./AuthFormControls";

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
        <AuthHeading
          title="Provjerite email"
          subtitle={
            <>
              Ako račun s adresom{" "}
              <strong className="break-anywhere">{email}</strong> postoji,
              poslali smo link za resetiranje lozinke.
            </>
          }
        />
        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground text-pretty">
          Ne vidite email? Provjerite spam mapu ili pričekajte par minuta.
        </div>
        <AuthTextButton onClick={onBack}>← Natrag na prijavu</AuthTextButton>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <AuthHeading
        title="Zaboravljena lozinka"
        subtitle="Unesite email adresu vašeg računa i poslat ćemo vam link za resetiranje."
      />

      {error && <AuthError message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="reset-email"
          label="Email adresa"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          disabled={isLoading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
        />

        <AuthSubmitButton
          type="submit"
          loading={isLoading}
          loadingText="Slanje..."
        >
          Pošalji reset link
        </AuthSubmitButton>
      </form>

      <AuthTextButton onClick={onBack}>← Natrag na prijavu</AuthTextButton>
    </div>
  );
}
