"use client";

import { useState } from "react";
import {
  ShieldCheck,
  User as UserIcon,
  Ban,
  CheckCircle2,
  Trash2,
  Loader2,
  Sun,
  KeyRound,
  Mail,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminUserResponse, AdminRole } from "@/lib/api/types";

// ============================================================
// Redak jednog admin korisnika.
//
// SIGURNOSNE BLOKADE (frontend, jer backend ih ne jamči):
//  1. Ne možeš onemogućiti/obrisati SAM SEBE — inače se
//     superadmin može zaključati iz vlastitog sustava.
//  2. Ne možeš onemogućiti/obrisati/degradirati ZADNJEG aktivnog
//     SUPERADMINA — bez njega više nitko ne može upravljati
//     korisnicima ni pozivnicama.
//
// Obje blokade su UI zaštita od nesreće; pravu provjeru bi
// trebao raditi i backend.
// ============================================================

export interface AdminUserRowProps {
  user: AdminUserResponse;
  /** ID trenutno prijavljenog korisnika */
  currentUserId: number | undefined;
  /** Je li ovo zadnji preostali aktivni SUPERADMIN */
  isLastActiveSuperAdmin: boolean;
  onToggleEnabled: (user: AdminUserResponse, next: boolean) => void;
  onDelete: (user: AdminUserResponse) => void;
  onChangeRole: (user: AdminUserResponse, role: AdminRole) => void;
  isPending: boolean;
}

export function AdminUserRow({
  user,
  currentUserId,
  isLastActiveSuperAdmin,
  onToggleEnabled,
  onDelete,
  onChangeRole,
  isPending,
}: AdminUserRowProps) {
  const [showRoleSelect, setShowRoleSelect] = useState(false);

  const isSelf = user.id === currentUserId;

  // Razlog zbog kojeg su destruktivne akcije blokirane (ili null)
  const lockReason = isSelf
    ? "Ne možete mijenjati vlastiti račun ovdje."
    : isLastActiveSuperAdmin
      ? "Ovo je zadnji aktivni Super Admin — sustav bi ostao bez upravitelja."
      : null;

  const isLocked = lockReason !== null;

  return (
    <li
      className={cn(
        "rounded-2xl border bg-card p-4 transition-opacity",
        user.enabled ? "border-border" : "border-border bg-muted/30",
        isPending && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase",
            user.enabled
              ? "bg-muted text-muted-foreground"
              : "bg-muted/60 text-muted-foreground/60"
          )}
        >
          {user.fullName?.charAt(0) ?? "?"}
        </div>

        <div className="min-w-0 flex-1">
          {/* Ime + oznake */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span
              className={cn(
                "text-sm font-semibold",
                user.enabled ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {user.fullName || "(bez imena)"}
            </span>

            {isSelf && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.625rem] font-semibold text-primary">
                Vi
              </span>
            )}

            {!user.enabled && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[0.625rem] font-semibold text-muted-foreground">
                <Ban className="h-2.5 w-2.5" />
                Onemogućen
              </span>
            )}
          </div>

          <p className="mt-0.5 truncate text-xs text-muted-foreground break-anywhere">
            {user.email}
          </p>

          {/* Meta oznake */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide",
                user.role === "SUPERADMIN"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {user.role === "SUPERADMIN" ? (
                <ShieldCheck className="h-2.5 w-2.5" />
              ) : (
                <UserIcon className="h-2.5 w-2.5" />
              )}
              {user.role === "SUPERADMIN" ? "Super Admin" : "Admin"}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[0.625rem] font-medium text-muted-foreground">
              {user.authProvider === "GOOGLE" ? (
                <>
                  <Mail className="h-2.5 w-2.5" />
                  Google
                </>
              ) : (
                <>
                  <KeyRound className="h-2.5 w-2.5" />
                  Lozinka
                </>
              )}
            </span>

            {user.solarReportSubscribed && (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[0.625rem] font-medium text-muted-foreground"
                title="Prima tjedni solar izvještaj"
              >
                <Sun className="h-2.5 w-2.5" />
                Solar mail
              </span>
            )}
          </div>
        </div>

        {isPending && (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Akcije */}
      <div className="mt-3 border-t border-border pt-3">
        {isLocked ? (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3 shrink-0" />
            {lockReason}
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Omogući / onemogući */}
            <button
              type="button"
              disabled={isPending}
              onClick={() => onToggleEnabled(user, !user.enabled)}
              className={cn(
                "inline-flex min-h-[2.25rem] items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors active:scale-95 disabled:opacity-50",
                user.enabled
                  ? "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  : "border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
              )}
            >
              {user.enabled ? (
                <>
                  <Ban className="h-3.5 w-3.5" />
                  Onemogući
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Omogući
                </>
              )}
            </button>

            {/* Promjena role */}
            {showRoleSelect ? (
              <select
                autoFocus
                defaultValue={user.role}
                disabled={isPending}
                onChange={(e) => {
                  onChangeRole(user, e.target.value as AdminRole);
                  setShowRoleSelect(false);
                }}
                onBlur={() => setShowRoleSelect(false)}
                className="min-h-[2.25rem] rounded-lg border border-input bg-background px-2 text-xs"
              >
                <option value="ADMIN">Admin</option>
                <option value="SUPERADMIN">Super Admin</option>
              </select>
            ) : (
              <button
                type="button"
                disabled={isPending}
                onClick={() => setShowRoleSelect(true)}
                className="inline-flex min-h-[2.25rem] items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95 disabled:opacity-50"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Promijeni rolu
              </button>
            )}

            {/* Brisanje */}
            <button
              type="button"
              disabled={isPending}
              onClick={() => onDelete(user)}
              className="inline-flex min-h-[2.25rem] items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 active:scale-95 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Obriši
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
