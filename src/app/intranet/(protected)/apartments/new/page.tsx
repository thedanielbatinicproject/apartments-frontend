"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";
import { ApartmentDetailsForm } from "@/components/intranet/apartments/ApartmentDetailsForm";

// ============================================================
// /intranet/apartments/new — kreiranje apartmana.
//
// Namjerno samo osnovni podaci: slike i prijevodi se dodaju tek
// nakon što apartman postoji (backend rute za slike i prijevode
// traže postojeći {id}). Nakon spremanja idemo ravno na detalj.
// ============================================================

export default function NewApartmentPage() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <Link
        href="/intranet/apartments"
        className="inline-flex min-h-[2.5rem] items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Svi apartmani
      </Link>

      <div>
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          Novi apartman
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Unesite osnovne podatke — slike i ostale jezike dodajete nakon
          spremanja.
        </p>
      </div>

      <div className="flex gap-2.5 rounded-xl border border-border bg-muted/40 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-xs text-muted-foreground text-pretty">
          Apartman se kreira s hrvatskim prijevodom. Slike, ostale jezike i iCal
          sinkronizaciju postavljate na stranici apartmana nakon spremanja.
        </p>
      </div>

      <ApartmentDetailsForm
        apartment={null}
        onSaved={(saved) => router.push(`/intranet/apartments/${saved.id}`)}
      />
    </div>
  );
}
