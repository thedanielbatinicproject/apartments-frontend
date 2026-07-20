"use client";

import { useMemo, useState } from "react";
import { ShieldAlert, Users, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAsync, useMutation } from "@/hooks/use-async";
import {
  listAdminUsers,
  disableAdminUser,
  enableAdminUser,
  deleteAdminUser,
  changeAdminUserRole,
} from "@/lib/api/users";
import type { AdminUserResponse, AdminRole } from "@/lib/api/types";
import {
  AsyncBoundary,
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/intranet/ui/DataStates";
import { MyAccountCard } from "@/components/intranet/users/MyAccountCard";
import { AdminUserRow } from "@/components/intranet/users/AdminUserRow";
import { InvitesSection } from "@/components/intranet/users/InvitesSection";
import { useConfirm } from "@/components/ui/confirm-dialog";

// ============================================================
// /intranet/users — "Administratori" (SUPERADMIN-only)
//
// Tri sekcije, jedna ispod druge:
//   1. Moj račun    → solar pretplata (JEDINA ne-SUPERADMIN ruta)
//   2. Administratori → popis, omogući/onemogući, rola, brisanje
//   3. Pozivnice    → slanje, pregled statusa, opoziv
//
// Sidebar ovu stavku ionako skriva ne-superadminima, ali ruta se
// može otvoriti izravno preko URL-a, pa guard mora biti i ovdje.
// (Prava zaštita je backend — on vraća 403.)
// ============================================================

export default function AdminUsersPage() {
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();
  const confirm = useConfirm();

  const [pendingUserId, setPendingUserId] = useState<number | null>(null);

  const isSuperAdmin = currentUser?.role === "SUPERADMIN";

  const users = useAsync<AdminUserResponse[]>(() => listAdminUsers(), [], {
    enabled: isSuperAdmin,
  });

  // Zadnji aktivni SUPERADMIN se ne smije ukloniti — inače sustav
  // ostaje bez ikoga tko može upravljati korisnicima.
  const lastActiveSuperAdminId = useMemo(() => {
    const activeSuperAdmins = (users.data ?? []).filter(
      (u) => u.role === "SUPERADMIN" && u.enabled
    );
    return activeSuperAdmins.length === 1 ? activeSuperAdmins[0].id : null;
  }, [users.data]);

  const toggleEnabled = useMutation(
    async (target: AdminUserResponse, next: boolean) => {
      if (next) await enableAdminUser(target.id);
      else await disableAdminUser(target.id);
      return { id: target.id, next };
    },
    {
      onSuccess: (result) => {
        if (!result) return;
        users.setData((prev) =>
          prev
            ? prev.map((u) =>
                u.id === result.id ? { ...u, enabled: result.next } : u
              )
            : prev
        );
      },
    }
  );

  const removeUser = useMutation(
    async (target: AdminUserResponse) => {
      await deleteAdminUser(target.id);
    },
    { onSuccess: () => void users.refetch() }
  );

  const updateRole = useMutation(
    async (target: AdminUserResponse, role: AdminRole) => {
      await changeAdminUserRole(target.id, role);
    },
    { onSuccess: () => void users.refetch() }
  );

  // --- Guard: čekanje auth inicijalizacije ---
  if (isAuthLoading) {
    return <LoadingState label="Provjera ovlasti..." />;
  }

  // --- Guard: nije SUPERADMIN ---
  if (!isSuperAdmin) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
          <ShieldAlert className="h-5 w-5 text-amber-600" />
        </div>
        <h2 className="mt-3 text-base font-semibold text-foreground">
          Nemate pristup ovoj stranici
        </h2>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground text-pretty">
          Upravljanje administratorima dostupno je samo Super Admin ulozi. Vaša
          trenutna rola je{" "}
          <strong className="text-foreground">
            {currentUser?.role ?? "nepoznata"}
          </strong>
          .
        </p>
      </div>
    );
  }

  const handleToggle = async (target: AdminUserResponse, next: boolean) => {
    setPendingUserId(target.id);
    await toggleEnabled.run(target, next);
    setPendingUserId(null);
  };

  const handleDelete = async (target: AdminUserResponse) => {
    const confirmed = await confirm({
      title: "Obrisati administratora?",
      description: (
        <>
          Račun <strong className="break-anywhere">{target.email}</strong> bit će
          trajno uklonjen iz sustava.
        </>
      ),
      warning:
        "Ako želite samo privremeno spriječiti prijavu, koristite Onemogući — račun tada ostaje u evidenciji.",
      confirmLabel: "Obriši račun",
      variant: "destructive",
    });
    if (!confirmed) return;

    setPendingUserId(target.id);
    await removeUser.run(target);
    setPendingUserId(null);
  };

  const handleRoleChange = async (
    target: AdminUserResponse,
    role: AdminRole
  ) => {
    if (role === target.role) return;

    setPendingUserId(target.id);
    await updateRole.run(target, role);
    setPendingUserId(null);
  };

  const isRefreshing = users.isLoading && !users.isInitialLoading;

  return (
    <div className="space-y-6">
      {/* Zaglavlje */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            Administratori
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Upravljanje pristupom intranetu
          </p>
        </div>

        <button
          type="button"
          onClick={() => void users.refetch()}
          disabled={users.isLoading}
          aria-label="Osvježi popis"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* 1. Moj račun */}
      <MyAccountCard />

      {/* 2. Administratori */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Svi administratori
          {users.data && (
            <span className="ml-1.5 font-normal text-muted-foreground">
              ({users.data.length})
            </span>
          )}
        </h3>

        {toggleEnabled.error != null && (
          <ErrorState
            error={toggleEnabled.error}
            context="Promjena statusa korisnika"
            compact
          />
        )}
        {removeUser.error != null && (
          <ErrorState
            error={removeUser.error}
            context="Brisanje korisnika"
            compact
          />
        )}
        {updateRole.error != null && (
          <ErrorState
            error={updateRole.error}
            context="Promjena role"
            compact
          />
        )}

        <AsyncBoundary
          isLoading={users.isLoading}
          error={users.error}
          data={users.data}
          onRetry={() => void users.refetch()}
          context="Dohvat administratora"
          emptyFallback={
            <EmptyState
              icon={Users}
              title="Nema administratora"
              description="Neobično — trebali biste vidjeti barem vlastiti račun. Provjerite odgovor backenda."
            />
          }
        >
          {(list) => (
            <ul className="space-y-2.5">
              {[...list]
                // Aktivni prvi, pa abecedno po imenu
                .sort(
                  (a, b) =>
                    Number(b.enabled) - Number(a.enabled) ||
                    (a.fullName ?? "").localeCompare(b.fullName ?? "", "hr")
                )
                .map((item) => (
                  <AdminUserRow
                    key={item.id}
                    user={item}
                    currentUserId={currentUser?.id}
                    isLastActiveSuperAdmin={item.id === lastActiveSuperAdminId}
                    onToggleEnabled={handleToggle}
                    onDelete={handleDelete}
                    onChangeRole={handleRoleChange}
                    isPending={pendingUserId === item.id}
                  />
                ))}
            </ul>
          )}
        </AsyncBoundary>
      </section>

      {/* 3. Pozivnice */}
      <InvitesSection onInviteSent={() => void users.refetch()} />
    </div>
  );
}
