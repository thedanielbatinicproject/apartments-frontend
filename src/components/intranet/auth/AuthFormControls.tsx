"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

// ============================================================
// Zajedničke form kontrole za sve auth forme.
//
// Prije su iste Tailwind klase bile kopirane u 4 datoteke, pa je
// svaki mobilni popravak trebalo raditi 4 puta.
//
// Mobilna pravila ugrađena ovdje:
//  - min-h 3rem (48px) → udoban tap target, iznad HIG minimuma 44px
//  - font-size 16px na mobitelu (globals.css) → iOS ne zumira na focus
//  - inputmode/autocomplete → ispravna tipkovnica na telefonu
// ============================================================

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Dodatni sadržaj desno od labele (npr. "Zaboravili ste lozinku?") */
  labelAction?: React.ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  function AuthInput({ label, labelAction, className, id, ...props }, ref) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor={id}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
          {labelAction}
        </div>
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-xl border border-input bg-background px-3.5",
            // 48px na mobitelu, 40px na desktopu
            "min-h-[3rem] sm:min-h-[2.5rem]",
            "placeholder:text-muted-foreground",
            "transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
}

export function AuthSubmitButton({
  loading,
  loadingText,
  children,
  className,
  disabled,
  ...props
}: AuthButtonProps) {
  return (
    <button
      disabled={disabled ?? loading}
      className={cn(
        "flex w-full items-center justify-center rounded-xl bg-primary px-4",
        // Veliki, siguran tap target
        "min-h-[3rem] sm:min-h-[2.75rem]",
        "text-[0.9375rem] font-semibold text-primary-foreground sm:text-sm",
        "transition-all hover:opacity-90 active:scale-[0.99]",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
        className
      )}
      {...props}
    >
      {loading ? loadingText ?? "Učitavanje..." : children}
    </button>
  );
}

/** Tekstualni link-gumb (npr. "← Natrag na prijavu") s ispravnim tap targetom. */
export function AuthTextButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-[2.75rem] items-center text-sm text-muted-foreground",
        "underline-offset-4 transition-colors hover:text-foreground hover:underline",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/** Prikaz greške — jednak u svim formama. */
export function AuthError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive break-anywhere"
    >
      {message}
    </div>
  );
}

/** Naslov + podnaslov auth forme. */
export function AuthHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance sm:text-[1.75rem]">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-muted-foreground text-pretty">{subtitle}</p>
      )}
    </div>
  );
}
