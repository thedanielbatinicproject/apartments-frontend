"use client";

import { Suspense, use } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Settings2,
  Images,
  Languages,
  CalendarDays,
  Star,
  EyeOff,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync, useMutation } from "@/hooks/use-async";
import { getAdminApartment, setApartmentActive } from "@/lib/api/apartments";
import type { ApartmentResponse } from "@/lib/api/types";
import { Tabs, type TabItem } from "@/components/intranet/ui/Tabs";
import { ErrorState, LoadingState } from "@/components/intranet/ui/DataStates";
import { ApartmentDetailsForm } from "@/components/intranet/apartments/ApartmentDetailsForm";
import { ApartmentImagesTab } from "@/components/intranet/apartments/ApartmentImagesTab";
import { ApartmentTranslationsTab } from "@/components/intranet/apartments/ApartmentTranslationsTab";
import { ApartmentCalendarTab } from "@/components/intranet/apartments/ApartmentCalendarTab";
import { ApartmentReviewsTab } from "@/components/intranet/apartments/ApartmentReviewsTab";

// ============================================================
// /intranet/apartments/[id] — detalj apartmana.
//
// AKTIVNI TAB ŽIVI U URL-u (?tab=calendar), ne u useState.
//
// Zašto: s lokalnim stateom refresh (ili povratak iz pozadine na
// mobitelu, gdje OS zna ubiti karticu) baca korisnika natrag na
// "Osnovno" — a upravo je na mobitelu refresh čest.
//
// Zašto router.replace, a ne push: replace mijenja URL BEZ novog
// unosa u povijest. Rezultat je oboje odjednom — refresh i
// dijeljenje linka čuvaju tab, a "Natrag" i dalje vodi na listu
// apartmana umjesto da vrti korisnika kroz tabove.
// ============================================================

const TAB_IDS = [
  "details",
  "images",
  "translations",
  "calendar",
  "reviews",
] as const;

type TabId = (typeof TAB_IDS)[number];

function parseTab(value: string | null): TabId {
  return TAB_IDS.includes(value as TabId) ? (value as TabId) : "details";
}

export default function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 16: params je Promise, razrješava se s use()
  const { id } = use(params);

  // useSearchParams traži Suspense granicu iznad sebe
  return (
    <Suspense fallback={<LoadingState label="Učitavanje apartmana..." />}>
      <ApartmentDetailContent id={id} />
    </Suspense>
  );
}

function ApartmentDetailContent({ id }: { id: string }) {
  const apartmentId = Number(id);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Tab je izveden iz URL-a — nema zasebnog statea koji bi se
  // mogao razići s adresom.
  const activeTab = parseTab(searchParams.get("tab"));

  const setActiveTab = (next: TabId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", next);
    // replace + scroll:false → bez novog history unosa i bez skoka na vrh
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // VAŽNO: admin ruta, ne javna. Javni /api/apartments/{id} vraća
  // companyId i iCal URL-ove kao null (includeAdminFields=false),
  // pa bi forma pri spremanju te vrijednosti obrisala.
  const apartment = useAsync<ApartmentResponse>(
    () => getAdminApartment(apartmentId),
    [apartmentId],
    { enabled: Number.isFinite(apartmentId) }
  );

  const toggleActive = useMutation(
    async (next: boolean) => {
      await setApartmentActive(apartmentId, next);
      return next;
    },
    {
      onSuccess: (next) => {
        if (next === undefined) return;
        apartment.setData((prev) => (prev ? { ...prev, active: next } : prev));
      },
    }
  );

  // --- Neispravan ID u URL-u ---
  if (!Number.isFinite(apartmentId)) {
    return (
      <div className="space-y-4">
        <BackLink />
        <ErrorState
          error={new Error(`"${id}" nije valjan ID apartmana.`)}
          context="Neispravan URL"
        />
      </div>
    );
  }

  // --- Prvo učitavanje ---
  if (apartment.isInitialLoading) {
    return (
      <div className="space-y-4">
        <BackLink />
        <LoadingState label="Učitavanje apartmana..." />
      </div>
    );
  }

  // --- Greška bez podataka ---
  if (apartment.error && !apartment.data) {
    return (
      <div className="space-y-4">
        <BackLink />
        <ErrorState
          error={apartment.error}
          onRetry={() => void apartment.refetch()}
          context={`Dohvat apartmana #${apartmentId}`}
        />
      </div>
    );
  }

  if (!apartment.data) return null;

  const data = apartment.data;

  const missingTranslations = Math.max(
    0,
    4 - (data.availableLanguages?.length ?? 0)
  );

  const tabs: TabItem[] = [
    { id: "details", label: "Osnovno", icon: Settings2 },
    {
      id: "images",
      label: "Slike",
      icon: Images,
      badge: data.images.length,
      badgeWarning: data.images.length === 0,
    },
    {
      id: "translations",
      label: "Prijevodi",
      icon: Languages,
      badge: missingTranslations > 0 ? missingTranslations : undefined,
      badgeWarning: missingTranslations > 0,
    },
    { id: "calendar", label: "Kalendar", icon: CalendarDays },
    { id: "reviews", label: "Recenzije", icon: Star },
  ];

  return (
    <div className="space-y-4">
      <BackLink />

      {/* Zaglavlje */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground text-balance sm:text-xl">
            {data.name || data.internalCode}
          </h2>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            {data.internalCode} · ID {data.id}
          </p>
        </div>

        {/* Prekidač vidljivosti */}
        <button
          type="button"
          onClick={() => void toggleActive.run(!data.active)}
          disabled={toggleActive.isPending}
          className={cn(
            "inline-flex min-h-[2.5rem] shrink-0 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition-colors active:scale-[0.98] disabled:opacity-50",
            data.active
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "border-border bg-card text-muted-foreground"
          )}
        >
          {data.active ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
          {data.active ? "Vidljiv" : "Skriven"}
        </button>
      </div>

      {toggleActive.error != null && (
        <ErrorState
          error={toggleActive.error}
          context="Promjena vidljivosti"
          compact
        />
      )}

      {/* Upozorenje o fallback prijevodu */}
      {data.translationFallbackUsed && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:border-amber-500/25 dark:bg-amber-950/20 dark:text-amber-300">
          Hrvatski prijevod ne postoji — prikazuje se fallback jezik. Dodajte ga
          u tabu <strong>Prijevodi</strong>.
        </div>
      )}

      <Tabs
        tabs={tabs}
        activeId={activeTab}
        onChange={(tabId) => setActiveTab(tabId as TabId)}
      />

      {/* Sadržaj taba */}
      <div>
        {activeTab === "details" && (
          <ApartmentDetailsForm
            apartment={data}
            onSaved={() => void apartment.refetch()}
            onDeleted={() => router.push("/intranet/apartments")}
          />
        )}

        {activeTab === "images" && (
          <ApartmentImagesTab
            apartmentId={data.id}
            images={data.images}
            onChanged={() => void apartment.refetch()}
          />
        )}

        {activeTab === "translations" && (
          <ApartmentTranslationsTab
            apartmentId={data.id}
            onChanged={() => void apartment.refetch()}
          />
        )}

        {activeTab === "calendar" && (
          <ApartmentCalendarTab apartmentId={data.id} />
        )}

        {activeTab === "reviews" && (
          <ApartmentReviewsTab apartmentId={data.id} />
        )}
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/intranet/apartments"
      className="inline-flex min-h-[2.5rem] items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      Svi apartmani
    </Link>
  );
}
