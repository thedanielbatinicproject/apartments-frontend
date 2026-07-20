"use client";

import { useState } from "react";
import { Check, Loader2, Trash2, X, Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync, useMutation } from "@/hooks/use-async";
import { listCompanies } from "@/lib/api/companies";
import {
  createApartment,
  updateApartment,
  deleteApartment,
} from "@/lib/api/apartments";
import type {
  ApartmentResponse,
  ApartmentRequest,
  CompanyResponse,
} from "@/lib/api/types";
import { ErrorState } from "@/components/intranet/ui/DataStates";
import { useConfirm } from "@/components/ui/confirm-dialog";

// ============================================================
// Tab "Osnovno" — ujedno i forma za kreiranje novog apartmana.
//
// Backend zahtijeva `translations` (min 1) i pri UPDATE-u, pa
// forma uvijek šalje barem hrvatski prijevod. Fina obrada
// prijevoda je u zasebnom tabu.
// ============================================================

/** Najčešći sadržaji — klik dodaje/miče, ali može se upisati i vlastiti. */
const COMMON_AMENITIES = [
  "WiFi",
  "Klima",
  "Parking",
  "Terasa",
  "Pogled na more",
  "Perilica rublja",
  "Perilica posuđa",
  "TV",
  "Kuhinja",
  "Roštilj",
  "Bazen",
  "Lift",
  "Kućni ljubimci",
  "Dječji krevetić",
];

interface ApartmentDetailsFormProps {
  /** null = kreiranje novog apartmana */
  apartment: ApartmentResponse | null;
  onSaved: (saved: ApartmentResponse) => void | Promise<void>;
  onDeleted?: () => void;
}

export function ApartmentDetailsForm({
  apartment,
  onSaved,
  onDeleted,
}: ApartmentDetailsFormProps) {
  const isNew = apartment === null;
  const confirm = useConfirm();

  const [internalCode, setInternalCode] = useState(
    apartment?.internalCode ?? ""
  );
  const [name, setName] = useState(apartment?.name ?? "");
  const [description, setDescription] = useState(apartment?.description ?? "");
  const [roomCount, setRoomCount] = useState(
    apartment?.roomCount?.toString() ?? ""
  );
  const [capacity, setCapacity] = useState(
    apartment?.capacity?.toString() ?? ""
  );
  const [sortOrder, setSortOrder] = useState(
    apartment?.sortOrder?.toString() ?? ""
  );
  const [latitude, setLatitude] = useState(
    apartment?.latitude?.toString() ?? ""
  );
  const [longitude, setLongitude] = useState(
    apartment?.longitude?.toString() ?? ""
  );
  const [amenities, setAmenities] = useState<string[]>(
    apartment?.amenities ?? []
  );
  const [customAmenity, setCustomAmenity] = useState("");
  const [airbnbIcalUrl, setAirbnbIcalUrl] = useState(
    apartment?.airbnbIcalUrl ?? ""
  );
  const [bookingIcalUrl, setBookingIcalUrl] = useState(
    apartment?.bookingIcalUrl ?? ""
  );
  // companyId dolazi izravno iz backenda (ApartmentResponse).
  // Zato je bitno da detalj čita s ADMIN rute — na javnoj je null.
  const [companyId, setCompanyId] = useState<string>(
    apartment?.companyId?.toString() ?? ""
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  const companies = useAsync<CompanyResponse[]>(() => listCompanies(), []);

  // Ako postoji samo jedna firma, odaberi je automatski (vrijedi
  // samo za novi apartman — postojeći ima companyId iz backenda).
  const onlyCompanyId =
    companies.data?.length === 1 ? String(companies.data[0].id) : "";

  const resolvedCompanyId = companyId || onlyCompanyId;

  const toggleAmenity = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const addCustomAmenity = () => {
    const value = customAmenity.trim();
    if (!value || amenities.includes(value)) return;
    setAmenities((prev) => [...prev, value]);
    setCustomAmenity("");
  };

  const toNumber = (value: string): number | null => {
    const trimmed = value.trim();
    if (trimmed === "") return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const save = useMutation(
    async () => {
      const payload: ApartmentRequest = {
        internalCode: internalCode.trim(),
        roomCount: toNumber(roomCount),
        capacity: toNumber(capacity),
        latitude: toNumber(latitude),
        longitude: toNumber(longitude),
        companyId: Number(resolvedCompanyId),
        amenities,
        active: apartment?.active ?? true,
        sortOrder: toNumber(sortOrder),
        airbnbIcalUrl: airbnbIcalUrl.trim() || null,
        bookingIcalUrl: bookingIcalUrl.trim() || null,
        // Backend traži min 1 prijevod i pri update-u
        translations: [
          {
            languageCode: "hr",
            name: name.trim(),
            description: description.trim(),
          },
        ],
      };

      return isNew
        ? createApartment(payload)
        : updateApartment(apartment.id, payload);
    },
    { onSuccess: (saved) => saved && void onSaved(saved) }
  );

  const remove = useMutation(
    async () => {
      if (!apartment) return;
      await deleteApartment(apartment.id);
    },
    { onSuccess: () => onDeleted?.() }
  );

  const missingCompany = !resolvedCompanyId;
  const canSave =
    internalCode.trim().length > 0 &&
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    !missingCompany;

  const inputClass =
    "min-h-[3rem] w-full rounded-xl border border-input bg-background px-3.5 transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40 sm:min-h-[2.5rem]";

  return (
    <div className="space-y-4">
      {save.error != null && (
        <ErrorState
          error={save.error}
          context={isNew ? "Kreiranje apartmana" : "Spremanje apartmana"}
          compact
        />
      )}
      {remove.error != null && (
        <ErrorState error={remove.error} context="Brisanje apartmana" compact />
      )}
      {companies.error != null && (
        <ErrorState
          error={companies.error}
          onRetry={() => void companies.refetch()}
          context="Dohvat firmi (potrebno za companyId)"
          compact
        />
      )}

      {/* --- Identifikacija --- */}
      <section className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground">Osnovni podaci</h3>

        <div className="space-y-2">
          <label htmlFor="internalCode" className="text-sm font-medium text-foreground">
            Interna oznaka <span className="text-destructive">*</span>
          </label>
          <input
            id="internalCode"
            value={internalCode}
            onChange={(e) => setInternalCode(e.target.value)}
            placeholder="npr. APT-OLIVA"
            className={cn(inputClass, "font-mono")}
          />
          <p className="text-xs text-muted-foreground">
            Interni kod za prepoznavanje apartmana. Ne prikazuje se gostima.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="apt-name" className="text-sm font-medium text-foreground">
            Naziv (HR) <span className="text-destructive">*</span>
          </label>
          <input
            id="apt-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="npr. Apartman Oliva"
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="apt-desc" className="text-sm font-medium text-foreground">
            Opis (HR) <span className="text-destructive">*</span>
          </label>
          <textarea
            id="apt-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Kratki opis apartmana..."
            className="w-full rounded-xl border border-input bg-background px-3.5 py-3 leading-relaxed transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <p className="text-xs text-muted-foreground">
            Ostali jezici se dodaju u tabu <strong>Prijevodi</strong>.
          </p>
        </div>

        {/* Firma */}
        <div className="space-y-2">
          <label htmlFor="companyId" className="text-sm font-medium text-foreground">
            Firma / vlasnik <span className="text-destructive">*</span>
          </label>
          <select
            id="companyId"
            value={resolvedCompanyId}
            onChange={(e) => setCompanyId(e.target.value)}
            disabled={companies.isLoading}
            className={inputClass}
          >
            <option value="">
              {companies.isLoading ? "Učitavanje firmi..." : "— odaberi firmu —"}
            </option>
            {(companies.data ?? []).map((company) => (
              <option key={company.id} value={company.id}>
                {company.brandName}
              </option>
            ))}
          </select>

          {missingCompany && !companies.isLoading && (
            <p className="text-xs text-amber-600">
              Obavezno — backend zahtijeva companyId pri spremanju.
            </p>
          )}

        </div>
      </section>

      {/* --- Kapacitet --- */}
      <section className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground">Kapacitet</h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label htmlFor="roomCount" className="text-sm font-medium text-foreground">
              Broj soba
            </label>
            <input
              id="roomCount"
              type="number"
              inputMode="numeric"
              min={0}
              value={roomCount}
              onChange={(e) => setRoomCount(e.target.value)}
              placeholder="2"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="capacity" className="text-sm font-medium text-foreground">
              Broj osoba
            </label>
            <input
              id="capacity"
              type="number"
              inputMode="numeric"
              min={0}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="4"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* --- Sadržaji --- */}
      <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground">
          Sadržaji
          {amenities.length > 0 && (
            <span className="ml-1.5 font-normal text-muted-foreground">
              ({amenities.length})
            </span>
          )}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {COMMON_AMENITIES.map((item) => {
            const selected = amenities.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleAmenity(item)}
                className={cn(
                  "inline-flex min-h-[2.25rem] items-center gap-1 rounded-full border px-3 text-xs font-medium transition-colors active:scale-95",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                {selected && <Check className="h-3 w-3" />}
                {item}
              </button>
            );
          })}
        </div>

        {/* Vlastiti sadržaji koji nisu u listi */}
        {amenities.filter((a) => !COMMON_AMENITIES.includes(a)).length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
            {amenities
              .filter((a) => !COMMON_AMENITIES.includes(a))
              .map((item) => (
                <span
                  key={item}
                  className="inline-flex min-h-[2.25rem] items-center gap-1.5 rounded-full border border-primary bg-primary px-3 text-xs font-medium text-primary-foreground"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => toggleAmenity(item)}
                    aria-label={`Ukloni ${item}`}
                    className="opacity-70 hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomAmenity();
              }
            }}
            placeholder="Dodaj vlastiti sadržaj"
            className={inputClass}
          />
          <button
            type="button"
            onClick={addCustomAmenity}
            disabled={!customAmenity.trim()}
            aria-label="Dodaj sadržaj"
            className="flex min-h-[3rem] w-12 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 sm:min-h-[2.5rem]"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* --- Napredno --- */}
      <section className="rounded-2xl border border-border bg-card">
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          aria-expanded={showAdvanced}
          className="flex min-h-[3.25rem] w-full items-center justify-between px-4 text-sm font-semibold text-foreground"
        >
          Napredno — lokacija i iCal
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              showAdvanced && "rotate-180"
            )}
          />
        </button>

        {showAdvanced && (
          <div className="space-y-4 border-t border-border p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="latitude" className="text-sm font-medium text-foreground">
                  Geo širina
                </label>
                <input
                  id="latitude"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="43.7350"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="longitude" className="text-sm font-medium text-foreground">
                  Geo dužina
                </label>
                <input
                  id="longitude"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="15.8952"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="sortOrder" className="text-sm font-medium text-foreground">
                Redoslijed prikaza
              </label>
              <input
                id="sortOrder"
                type="number"
                inputMode="numeric"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                placeholder="1"
                className={inputClass}
              />
              <p className="text-xs text-muted-foreground">
                Manji broj = prikazuje se ranije na javnoj stranici.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="airbnbIcal" className="text-sm font-medium text-foreground">
                Airbnb iCal URL
              </label>
              <input
                id="airbnbIcal"
                type="url"
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={airbnbIcalUrl}
                onChange={(e) => setAirbnbIcalUrl(e.target.value)}
                placeholder="https://www.airbnb.com/calendar/ical/..."
                className={cn(inputClass, "text-xs")}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bookingIcal" className="text-sm font-medium text-foreground">
                Booking.com iCal URL
              </label>
              <input
                id="bookingIcal"
                type="url"
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={bookingIcalUrl}
                onChange={(e) => setBookingIcalUrl(e.target.value)}
                placeholder="https://admin.booking.com/hotel/hoteladmin/ical..."
                className={cn(inputClass, "text-xs")}
              />
              <p className="text-xs text-muted-foreground">
                Nakon spremanja pokrenite sync u tabu <strong>Kalendar</strong>.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* --- Akcije --- */}
      <div className="flex flex-col gap-2 xs:flex-row">
        <button
          type="button"
          onClick={() => void save.run()}
          disabled={!canSave || save.isPending}
          className="inline-flex min-h-[3rem] flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
        >
          {save.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          {isNew ? "Kreiraj apartman" : "Spremi izmjene"}
        </button>

        {!isNew && onDeleted && (
          <button
            type="button"
            onClick={async () => {
              const ok = await confirm({
                title: "Obrisati apartman?",
                description: `Apartman ${apartment.internalCode} i sve što mu pripada bit će trajno uklonjeno.`,
                warning:
                  "Brišu se i sve slike i svi prijevodi. Ovo se ne može poništiti.",
                confirmLabel: "Obriši apartman",
                variant: "destructive",
              });
              if (ok) void remove.run();
            }}
            disabled={remove.isPending}
            className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 active:scale-[0.98] disabled:opacity-50"
          >
            {remove.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Obriši
          </button>
        )}
      </div>

      {!canSave && (
        <p className="text-center text-xs text-muted-foreground">
          Obavezna polja: interna oznaka, naziv, opis i firma.
        </p>
      )}
    </div>
  );
}
