"use client";

import { useState, Suspense } from "react";
import { LoginForm } from "@/components/intranet/auth/LoginForm";
import { ForgotPasswordForm } from "@/components/intranet/auth/ForgotPasswordForm";

type AuthView = "login" | "forgot-password";

function LoginPageContent() {
  const [view, setView] = useState<AuthView>("login");

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Gornja/Lijeva kolona — branding */}
      <div className="relative flex flex-col justify-between bg-primary p-8 lg:w-1/2 lg:p-12 overflow-hidden">
        {/* Pozadinski mediteranski uzorak / gradijent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/20 via-primary to-primary"></div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg">
            <span className="text-sm font-bold text-primary">AŠ</span>
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">
            Apartments Šibenik
          </span>
        </div>

        <div className="relative z-10 my-12 lg:my-0 space-y-5">
          <blockquote className="text-2xl lg:text-3xl font-semibold text-white leading-tight">
            Dobrodošli u srce <br className="hidden lg:block"/> vašeg poslovanja.
          </blockquote>
          <p className="text-primary-foreground/80 text-base max-w-sm">
            Upravljajte apartmanima, pratite solarnu energiju i vodite račune kroz jedan siguran sustav.
          </p>
        </div>

        <p className="relative z-10 text-xs font-medium text-primary-foreground/50 hidden lg:block">
          © {new Date().getFullYear()} Apartments Šibenik
        </p>
      </div>

      {/* Donja/Desna kolona — forma */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12 bg-background rounded-t-[2rem] -mt-8 lg:mt-0 lg:rounded-none z-20 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] lg:shadow-none">
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
