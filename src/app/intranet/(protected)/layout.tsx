"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { IntranetShell } from "@/components/intranet/layout/IntranetShell";
import { CompanyProvider } from "@/lib/company/company-context";
import { ApartmentProvider } from "@/lib/apartment/apartment-context";

// Auth-guard layout za cijelu (intranet) route grupu (sve unutar /intranet osim javnih auth ruta).
// - Prikazuje loading spinner dok se inicijalizira auth state.
// - Ako korisnik nije prijavljen → redirect na /intranet/login.
// - Ako jest → prikazuje IntranetShell (sidebar + header + sadržaj).

export default function ProtectedIntranetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/intranet/login");
    }
  }, [user, isLoading, router]);

  // Loading state — prikaži dok se provjerava auth
  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-sm text-muted-foreground">Učitavanje...</p>
        </div>
      </div>
    );
  }

  // Ne prikazuje ništa dok redirect ne završi
  if (!user) {
    return null;
  }

  // CompanyProvider/ApartmentProvider su unutar auth guarda jer dohvat traži JWT
  return (
    <CompanyProvider>
      <ApartmentProvider>
        <IntranetShell>{children}</IntranetShell>
      </ApartmentProvider>
    </CompanyProvider>
  );
}
