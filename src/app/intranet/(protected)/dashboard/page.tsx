"use client";

import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">
          Dobrodošli, {user?.fullName || "Admin"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Ovo je početni ekran intranet sustava. Vaša razina pristupa je:{" "}
          <strong className="text-foreground">{user?.role}</strong>.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder kartice */}
        {[
          { title: "Status Apartmana", value: "3 aktivna" },
          { title: "Solarni Sustav", value: "Proizvodnja OK" },
          { title: "Nepročitane Recenzije", value: "2 nove" },
        ].map((card, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <h3 className="text-sm font-medium text-muted-foreground">
              {card.title}
            </h3>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
