"use client";

import { useState, Suspense } from "react";
import { LoginForm } from "@/components/intranet/auth/LoginForm";
import { ForgotPasswordForm } from "@/components/intranet/auth/ForgotPasswordForm";

type AuthView = "login" | "forgot-password";

// ============================================================
// Login ekran.
//
// MOBITEL: kompaktna brandirana traka na vrhu (~140px) pa forma
//   koja dobiva ostatak ekrana. Prije je branding panel s velikim
//   citatom i p-8 paddingom gurao formu skoro izvan ekrana na
//   iPhone SE, a s otvorenom tipkovnicom je forma bila nedostupna.
//
// DESKTOP (lg+): klasični 50/50 split s punim brandingom.
// ============================================================

function LoginPageContent() {
  const [view, setView] = useState<AuthView>("login");

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      {/* ---------- Branding panel ---------- */}
      {/* Razmaci idu kroz max() arbitrary vrijednosti, a ne kroz klase
          pt-safe/px-safe — one su na desktopu 0px i poništile bi
          lg:px-12 / lg:py-12 (ista @layer utilities kaskada). */}
      <div className="relative flex shrink-0 flex-col justify-between overflow-hidden bg-primary px-[max(1.25rem,env(safe-area-inset-left))] pt-[env(safe-area-inset-top)] lg:w-1/2 lg:px-12 lg:py-12">
        {/* Pozadinski mediteranski gradijent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/20 via-primary to-primary" />
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/5 blur-3xl lg:h-64 lg:w-64" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-teal-400/10 blur-3xl lg:h-80 lg:w-80" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 pt-5 lg:pt-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-lg lg:h-10 lg:w-10">
            <span className="text-sm font-bold text-primary">AŠ</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-white lg:text-xl">
            Apartments Šibenik
          </span>
        </div>

        {/* Slogan — na mobitelu kratak, na desktopu pun */}
        <div className="relative z-10 space-y-2 pt-5 pb-9 lg:my-0 lg:space-y-5 lg:pt-0 lg:pb-0">
          <blockquote className="text-xl font-semibold leading-tight text-white text-balance lg:text-3xl">
            Dobrodošli u srce
            <br className="hidden lg:block" /> vašeg poslovanja.
          </blockquote>
          {/* Duži opis samo na desktopu — na mobitelu troši dragocjenu visinu */}
          <p className="hidden max-w-sm text-base text-primary-foreground/80 lg:block">
            Upravljajte apartmanima, pratite solarnu energiju i vodite račune
            kroz jedan siguran sustav.
          </p>
        </div>

        <p className="relative z-10 hidden text-xs font-medium text-primary-foreground/50 lg:block">
          © {new Date().getFullYear()} Apartments Šibenik
        </p>
      </div>

      {/* ---------- Forma ---------- */}
      <div className="z-20 -mt-6 flex flex-1 items-start justify-center rounded-t-3xl bg-background px-[max(1.25rem,env(safe-area-inset-left))] pt-8 pb-[max(2.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] sm:px-8 lg:mt-0 lg:items-center lg:rounded-none lg:px-12 lg:py-12 lg:shadow-none">
        <div className="w-full max-w-sm">
          {view === "login" ? (
            <LoginForm onForgotPassword={() => setView("forgot-password")} />
          ) : (
            <ForgotPasswordForm onBack={() => setView("login")} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}
