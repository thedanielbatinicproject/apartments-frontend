"use client";

import { Sun, Loader2, Mail, ShieldCheck, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@/hooks/use-async";
import { setSolarReportSubscription } from "@/lib/api/users";
import { ErrorState } from "@/components/intranet/ui/DataStates";

// ============================================================
// Kartica "Moj račun".
//
// Jedina sekcija na ovoj stranici koja NIJE SUPERADMIN-only —
// PATCH /users/me/solar-report-subscription mijenja isključivo
// VLASTITU pretplatu prijavljenog korisnika.
//
// Zato je vizualno odvojena od upravljanja tuđim računima, da se
// ne pomiješa "moje postavke" s "administriranje drugih".
// ============================================================

export function MyAccountCard() {
  const { user, refreshUser } = useAuth();

  const toggleSolar = useMutation(
    async (next: boolean) => {
      await setSolarReportSubscription(next);
    },
    {
      // Osvježi globalni user da se stanje ne raziđe s ostatkom appa
      onSuccess: () => refreshUser(),
    }
  );

  if (!user) return null;

  const subscribed = user.solarReportSubscribed;

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Moj račun</h3>

      <div className="rounded-2xl border border-border bg-card p-4">
        {/* Identitet */}
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold uppercase text-muted-foreground">
            {user.fullName?.charAt(0) ?? "?"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {user.fullName}
            </p>
            <p className="truncate text-xs text-muted-foreground break-anywhere">
              {user.email}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide",
                  user.role === "SUPERADMIN"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <ShieldCheck className="h-2.5 w-2.5" />
                {user.role === "SUPERADMIN" ? "Super Admin" : "Admin"}
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[0.625rem] font-medium text-muted-foreground">
                {user.authProvider === "GOOGLE" ? (
                  <>
                    <Mail className="h-2.5 w-2.5" />
                    Google prijava
                  </>
                ) : (
                  <>
                    <KeyRound className="h-2.5 w-2.5" />
                    Lozinka
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Solar pretplata */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex min-w-0 gap-2.5">
            <Sun className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                Tjedni solar izvještaj
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground text-pretty">
                {subscribed
                  ? "Primate tjedni pregled proizvodnje na email."
                  : "Ne primate tjedni pregled proizvodnje."}
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={subscribed}
            aria-label="Pretplata na tjedni solar izvještaj"
            disabled={toggleSolar.isPending}
            onClick={() => void toggleSolar.run(!subscribed)}
            className={cn(
              "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card",
              "disabled:cursor-not-allowed disabled:opacity-50",
              subscribed ? "bg-primary" : "bg-muted-foreground/30"
            )}
          >
            {toggleSolar.isPending ? (
              <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin text-background" />
            ) : (
              <span
                className={cn(
                  "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                  subscribed ? "translate-x-6" : "translate-x-1"
                )}
              />
            )}
          </button>
        </div>

        {toggleSolar.error != null && (
          <div className="mt-3">
            <ErrorState
              error={toggleSolar.error}
              context="Promjena solar pretplate"
              compact
            />
          </div>
        )}
      </div>
    </section>
  );
}
