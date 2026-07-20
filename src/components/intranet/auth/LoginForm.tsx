"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/types";
import {
  AuthInput,
  AuthSubmitButton,
  AuthError,
  AuthHeading,
} from "./AuthFormControls";

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

  // --- Google gumb ---
  //
  // Dvije odvojene stvari, namjerno razdvojene:
  //
  // 1. ŠIRINA. Google renderira iframe fiksne piksel širine i
  //    prihvaća samo 200–400px. Mjerimo kontejner da gumb prati
  //    formu. Ovo je SAMO dorada — gumb se renderira i bez mjere,
  //    jer bi inače neuspjelo mjerenje značilo da gumba nema.
  //
  // 2. JE LI SE UOPĆE POJAVIO. Ako Google odbije (npr. origin nije
  //    na popisu u Cloud Console), skripta tiho ne nacrta ništa i
  //    korisnik gleda prazninu bez ikakvog objašnjenja. Zato nakon
  //    kratke pauze provjeravamo je li iframe stvarno tu.
  const googleWrapRef = useRef<HTMLDivElement>(null);
  const [googleWidth, setGoogleWidth] = useState<number | undefined>(undefined);
  const [googleMissing, setGoogleMissing] = useState(false);

  useEffect(() => {
    const element = googleWrapRef.current;
    if (!element) return;

    const measure = () => {
      const width = Math.round(element.getBoundingClientRect().width);
      if (width > 0) {
        setGoogleWidth(Math.max(200, Math.min(400, width)));
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    // Google ubaci <iframe> kad uspješno inicijalizira gumb
    const check = setTimeout(() => {
      setGoogleMissing(!element.querySelector("iframe"));
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(check);
    };
  }, []);

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
      <AuthHeading
        title="Dobrodošli natrag"
        subtitle="Prijavite se u Apartments Šibenik intranet."
      />

      {error && <AuthError message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="email"
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

        <AuthInput
          id="password"
          label="Lozinka"
          type="password"
          autoComplete="current-password"
          required
          disabled={isLoading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          labelAction={
            <button
              type="button"
              onClick={onForgotPassword}
              className="shrink-0 py-1 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Zaboravili ste lozinku?
            </button>
          }
        />

        <AuthSubmitButton
          type="submit"
          loading={isLoading}
          loadingText="Prijava u tijeku..."
        >
          Prijavi se
        </AuthSubmitButton>
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

      {/* Google gumb.
          Google renderira iframe FIKSNE piksel širine — ne postoji
          način da se rastegne CSS-om. Zato širinu mjerimo iz
          kontejnera i prosljeđujemo je.

          Prije je ovdje stajao width="320" uz overflow-hidden: na
          užim ekranima iframe je bio širi od kontejnera, a jer je
          centriran prelijevao se na obje strane i bio odrezan —
          gumb se na mobitelu nije vidio. */}
      <div ref={googleWrapRef} className="flex w-full justify-center">
        <GoogleLogin
          // Remount pri promjeni širine (npr. rotacija ekrana) —
          // Google ne prerenderira iframe sam od sebe
          key={googleWidth ?? "auto"}
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google prijava otkazana ili neuspješna.")}
          useOneTap
          theme="outline"
          size="large"
          width={googleWidth ? String(googleWidth) : undefined}
          text="continue_with"
        />
      </div>

      {/* Gumb se nije pojavio — objasni zašto umjesto prazne rupe */}
      {googleMissing && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-50 px-4 py-3 dark:border-amber-500/25 dark:bg-amber-950/20">
          <p className="text-xs text-amber-800 text-pretty dark:text-amber-300">
            <strong>Google prijava nije dostupna.</strong> Najčešći uzrok je da
            adresa s koje otvarate stranicu nije upisana u{" "}
            <em>Authorized JavaScript origins</em> u Google Cloud Console —
            npr. kad se s mobitela spajate preko IP adrese umjesto
            <code className="mx-1 font-mono">localhost</code>.
          </p>
          <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-400">
            Prijava emailom i lozinkom radi normalno.
          </p>
        </div>
      )}
    </div>
  );
}
