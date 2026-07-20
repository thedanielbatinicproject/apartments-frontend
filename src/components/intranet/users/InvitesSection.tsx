"use client";

import { useState } from "react";
import {
  Send,
  Loader2,
  MailPlus,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync, useMutation } from "@/hooks/use-async";
import {
  listAdminInvites,
  inviteAdminUser,
  revokeAdminInvite,
} from "@/lib/api/users";
import type { AdminInviteResponse, AdminRole } from "@/lib/api/types";
import {
  AsyncBoundary,
  EmptyState,
  ErrorState,
} from "@/components/intranet/ui/DataStates";
import { useConfirm } from "@/components/ui/confirm-dialog";

// ============================================================
// Sekcija "Pozivnice".
//
// Tok dodavanja admina je dvokoračan i to mora biti vidljivo:
//   1. SUPERADMIN pošalje pozivnicu (email + rola)
//   2. Primatelj otvori link, postavi ime i lozinku → tek TADA
//      nastaje račun i pojavljuje se u popisu administratora
//
// Dok pozivnica visi neiskorištena, korisnika NEMA u sustavu.
// Zato je popis pozivnica ravnopravna sekcija, a ne detalj.
// ============================================================

/** Status pozivnice izveden iz used/expired zastavica. */
type InviteStatus = "used" | "expired" | "pending";

function statusOf(invite: AdminInviteResponse): InviteStatus {
  if (invite.used) return "used";
  if (invite.expired) return "expired";
  return "pending";
}

const STATUS_META: Record<
  InviteStatus,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  used: {
    label: "Prihvaćena",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  expired: {
    label: "Istekla",
    className: "bg-muted text-muted-foreground",
    icon: XCircle,
  },
  pending: {
    label: "Čeka odgovor",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    icon: Clock,
  },
};

interface InvitesSectionProps {
  /** Poziva se nakon prihvaćene promjene da se osvježi i popis admina */
  onInviteSent: () => void | Promise<void>;
}

export function InvitesSection({ onInviteSent }: InvitesSectionProps) {
  const confirm = useConfirm();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("ADMIN");
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const invites = useAsync<AdminInviteResponse[]>(() => listAdminInvites(), []);

  const send = useMutation(
    async () => {
      await inviteAdminUser(email.trim(), role);
    },
    {
      onSuccess: async () => {
        setEmail("");
        setRole("ADMIN");
        await invites.refetch();
        await onInviteSent();
      },
    }
  );

  const revoke = useMutation(
    async (id: number) => {
      await revokeAdminInvite(id);
    },
    { onSuccess: () => void invites.refetch() }
  );

  const handleRevoke = async (invite: AdminInviteResponse) => {
    const ok = await confirm({
      title: "Opozvati pozivnicu?",
      description: (
        <>
          Link poslan na <strong className="break-anywhere">{invite.email}</strong>{" "}
          prestaje raditi.
        </>
      ),
      warning:
        "Ako je osoba već otvorila link ali nije dovršila registraciju, morat ćete poslati novu pozivnicu.",
      confirmLabel: "Opozovi",
      variant: "destructive",
    });
    if (!ok) return;

    setRevokingId(invite.id);
    await revoke.run(invite.id);
    setRevokingId(null);
  };

  // Jednostavna provjera formata — backend svejedno validira
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const pendingCount = (invites.data ?? []).filter(
    (i) => statusOf(i) === "pending"
  ).length;

  const inputClass =
    "min-h-[3rem] w-full rounded-xl border border-input bg-background px-3.5 transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40 sm:min-h-[2.5rem]";

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">
          Pozivnice
          {pendingCount > 0 && (
            <span className="ml-1.5 rounded-full bg-amber-500/15 px-2 py-0.5 text-[0.625rem] font-bold text-amber-700 dark:text-amber-400">
              {pendingCount} na čekanju
            </span>
          )}
        </h3>
      </div>

      {/* --- Slanje pozivnice --- */}
      <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <div className="flex gap-2.5">
          <MailPlus className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground text-pretty">
            Novi admin se ne kreira izravno — šaljete email s linkom, a račun
            nastaje tek kad primatelj postavi ime i lozinku.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="invite-email" className="text-sm font-medium text-foreground">
            Email adresa
          </label>
          <input
            id="invite-email"
            type="email"
            inputMode="email"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="novi.admin@example.com"
            disabled={send.isPending}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="invite-role" className="text-sm font-medium text-foreground">
            Rola
          </label>
          <select
            id="invite-role"
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            disabled={send.isPending}
            className={inputClass}
          >
            <option value="ADMIN">Admin — uobičajene ovlasti</option>
            <option value="SUPERADMIN">
              Super Admin — može upravljati adminima
            </option>
          </select>
          {role === "SUPERADMIN" && (
            <p className="text-xs text-amber-600">
              Super Admin može pozivati i onemogućavati druge administratore.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => void send.run()}
          disabled={!emailValid || send.isPending}
          className="inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 sm:min-h-[2.75rem]"
        >
          {send.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {send.isPending ? "Šaljem..." : "Pošalji pozivnicu"}
        </button>

        {send.error != null && (
          <ErrorState error={send.error} context="Slanje pozivnice" compact />
        )}
      </div>

      {revoke.error != null && (
        <ErrorState error={revoke.error} context="Opoziv pozivnice" compact />
      )}

      {/* --- Popis pozivnica --- */}
      <AsyncBoundary
        isLoading={invites.isLoading}
        error={invites.error}
        data={invites.data}
        onRetry={() => void invites.refetch()}
        context="Dohvat pozivnica"
        emptyFallback={
          <EmptyState
            icon={MailPlus}
            title="Nema poslanih pozivnica"
            description="Kad pošaljete pozivnicu, ovdje ćete pratiti je li prihvaćena, čeka odgovor ili je istekla."
          />
        }
      >
        {(list) => (
          <ul className="space-y-2">
            {[...list]
              // Neiskorištene prve — one traže akciju
              .sort((a, b) => Number(a.used) - Number(b.used))
              .map((invite) => {
                const status = statusOf(invite);
                const meta = STATUS_META[status];
                const StatusIcon = meta.icon;
                const isRevoking = revokingId === invite.id;

                return (
                  <li
                    key={invite.id}
                    className={cn(
                      "flex items-start justify-between gap-3 rounded-2xl border border-border bg-card p-3.5",
                      isRevoking && "opacity-60"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground break-anywhere">
                        {invite.email}
                      </p>

                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.625rem] font-semibold",
                            meta.className
                          )}
                        >
                          <StatusIcon className="h-2.5 w-2.5" />
                          {meta.label}
                        </span>

                        <span className="rounded-full bg-muted px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-muted-foreground">
                          {invite.role === "SUPERADMIN" ? "Super Admin" : "Admin"}
                        </span>
                      </div>

                      {status === "pending" && (
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          Vrijedi do{" "}
                          {new Date(invite.expiryDate).toLocaleString("hr-HR")}
                        </p>
                      )}
                    </div>

                    {/* Opoziv — samo za neiskorištene pozivnice */}
                    {!invite.used && (
                      <button
                        type="button"
                        onClick={() => void handleRevoke(invite)}
                        disabled={isRevoking}
                        aria-label={`Opozovi pozivnicu za ${invite.email}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-destructive transition-colors hover:bg-destructive/10 active:scale-95 disabled:opacity-50"
                      >
                        {isRevoking ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}
                  </li>
                );
              })}
          </ul>
        )}
      </AsyncBoundary>

      <p className="flex gap-2 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Prihvaćene pozivnice se ne mogu opozvati — takav račun se onemogućuje u
        popisu administratora.
      </p>
    </section>
  );
}
