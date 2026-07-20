"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Loader2,
  UserRound,
  Link2,
  X,
  Building2,
  ArrowRightLeft,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync, useMutation } from "@/hooks/use-async";
import Link from "next/link";
import {
  getCompanyCatalogs,
  updateCompanyCatalogs,
  getCompany,
} from "@/lib/api/companies";
import { missingRequiredFields } from "@/lib/company-utils";
import { listAdminApartments } from "@/lib/api/apartments";
import { createInvoice, updateInvoice } from "@/lib/api/invoices";
import type {
  InvoiceResponse,
  InvoiceRequest,
  InvoiceItemRequest,
  InvoiceDocumentType,
  CompanyCatalogs,
  CompanyResponse,
  ApartmentResponse,
} from "@/lib/api/types";
import {
  DOCUMENT_TYPES,
  computeTotals,
  formatMoney,
  nightsBetween,
  parseNumber,
  todayIso,
  DEFAULT_UNIT_PRICE,
} from "@/lib/invoice-utils";
import { ErrorState } from "@/components/intranet/ui/DataStates";
import { NumberStepper } from "@/components/ui/number-stepper";
import { InvoiceItemsEditor } from "./InvoiceItemsEditor";
import { CatalogSelect } from "./CatalogSelect";
import {
  GuestStayPicker,
  type GuestStaySelection,
} from "./GuestStayPicker";

// ============================================================
// Forma dokumenta.
//
// Tok je namjerno jednokoračan: ispuni → spremi → dokument je
// gotov i PDF je odmah dostupan. Nema međukoraka "nacrt pa
// potvrdi". Ispravke se rade uređivanjem gotovog dokumenta.
//
// Najbrži put do gotovog računa: gumb "Poveži s gostom" popuni
// ime, adresu, državu, apartman, datume, broj osoba i prvu
// stavku (noćenja × cijena). Ostane samo provjeriti i spremiti.
// ============================================================

const EMPTY_CATALOGS: CompanyCatalogs = {
  unitDescriptionCatalog: [],
  serviceTypeCatalog: [],
  paymentMethodCatalog: [],
};

interface InvoiceFormProps {
  companyId: number;
  companyName: string;
  currency: string;
  /** null = novi dokument */
  invoice: InvoiceResponse | null;
  onSaved: (saved: InvoiceResponse) => void | Promise<void>;
  /** Prikazuje karticu s firmom (samo pri kreiranju) */
  showCompanyBanner?: boolean;
  /** Javlja roditelju promjenu vrste da može promijeniti naslov */
  onDocumentTypeChange?: (type: InvoiceDocumentType) => void;
}

export function InvoiceForm({
  companyId,
  companyName,
  currency,
  invoice,
  onSaved,
  showCompanyBanner = false,
  onDocumentTypeChange,
}: InvoiceFormProps) {
  const isNew = invoice === null;

  const [documentType, setDocumentType] = useState<InvoiceDocumentType>(
    invoice?.documentType ?? "INVOICE"
  );
  const [invoiceDate, setInvoiceDate] = useState(
    invoice?.invoiceDate ?? todayIso()
  );
  const [apartmentId, setApartmentId] = useState<string>(
    invoice?.apartmentId?.toString() ?? ""
  );
  const [guestRecordId, setGuestRecordId] = useState<number | null>(
    invoice?.guestRecordId ?? null
  );
  const [linkedGuestLabel, setLinkedGuestLabel] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // --- Gost / firma ---
  //
  // OIB se traži samo kad se račun izdaje na firmu. Za obične
  // goste je nepotreban, pa je iza prekidača umjesto da stoji
  // kao još jedno prazno polje koje zbunjuje.
  const [isCompanyRecipient, setIsCompanyRecipient] = useState(
    Boolean(invoice?.recipientOib)
  );
  const [guestName, setGuestName] = useState(invoice?.recipientName ?? "");
  const [guestOib, setGuestOib] = useState(invoice?.recipientOib ?? "");
  const [guestAddress, setGuestAddress] = useState(
    invoice?.recipientAddress ?? ""
  );
  const [guestCountry, setGuestCountry] = useState(
    invoice?.recipientCountry ?? ""
  );

  // --- Boravak ---
  const [adults, setAdults] = useState<number>(invoice?.guestCount ?? 2);
  const [children, setChildren] = useState<number>(invoice?.childrenCount ?? 0);
  const [checkinDate, setCheckinDate] = useState(invoice?.checkinDate ?? "");
  const [checkoutDate, setCheckoutDate] = useState(invoice?.checkoutDate ?? "");

  // --- Stavke i iznosi ---
  const [items, setItems] = useState<InvoiceItemRequest[]>(
    invoice?.items?.length
      ? invoice.items.map((item) => ({
          unitDescription: item.unitDescription,
          serviceType: item.serviceType,
          roomNumber: item.roomNumber,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }))
      : [
          {
            unitDescription: "",
            serviceType: "",
            roomNumber: null,
            quantity: 1,
            unitPrice: DEFAULT_UNIT_PRICE,
          },
        ]
  );
  const [discountAmount, setDiscountAmount] = useState(
    invoice?.discountAmount?.toString() ?? ""
  );
  const [paymentMethod, setPaymentMethod] = useState(
    invoice?.paymentMethod ?? ""
  );
  const [customNotes, setCustomNotes] = useState(invoice?.customNotes ?? "");

  const catalogs = useAsync<CompanyCatalogs>(
    () => getCompanyCatalogs(companyId),
    [companyId]
  );

  const apartments = useAsync<ApartmentResponse[]>(
    () => listAdminApartments(),
    []
  );

  // Podaci firme se SNIMAJU u dokument pri izdavanju. Ako nešto
  // nedostaje, dokument zauvijek ostaje bez toga — pa upozorenje
  // mora doći ovdje, prije spremanja, a ne tek u Postavkama.
  const company = useAsync<CompanyResponse>(
    () => getCompany(companyId),
    [companyId]
  );

  const missingCompanyFields = missingRequiredFields(company.data);

  const catalogData = catalogs.data ?? EMPTY_CATALOGS;

  /** Sprema novu vrijednost u katalog firme da bude tu i idući put. */
  const addToCatalog = async (
    key: keyof CompanyCatalogs,
    value: string
  ): Promise<void> => {
    const current = catalogs.data ?? EMPTY_CATALOGS;
    if (current[key].includes(value)) return;

    const next: CompanyCatalogs = {
      ...current,
      [key]: [...current[key], value],
    };

    await updateCompanyCatalogs(companyId, next);
    catalogs.setData(next);
  };

  /** Popunjava račun iz odabranog boravka. */
  const applyGuestStay = ({ stay, payer }: GuestStaySelection) => {
    setGuestRecordId(payer.id);
    setLinkedGuestLabel(payer.fullName);

    setGuestName(payer.fullName ?? "");
    setGuestAddress(payer.placeOfResidence ?? "");
    setGuestCountry(payer.nationality ?? "");

    setApartmentId(String(stay.apartmentId));
    setCheckinDate(stay.arrivalDate ?? "");
    setCheckoutDate(stay.departureDate ?? "");
    setAdults(stay.adults > 0 ? stay.adults : 2);
    setChildren(stay.children);

    // Prva stavka: noćenja × zadana cijena
    const nights = nightsBetween(stay.arrivalDate, stay.departureDate);
    const apartmentLabel =
      apartments.data?.find((a) => a.id === stay.apartmentId)?.name ??
      stay.apartmentInternalCode ??
      "";

    setItems((prev) => {
      const first: InvoiceItemRequest = {
        ...prev[0],
        unitDescription:
          prev[0]?.unitDescription ||
          (catalogData.unitDescriptionCatalog.includes(apartmentLabel)
            ? apartmentLabel
            : catalogData.unitDescriptionCatalog[0] ?? apartmentLabel),
        serviceType:
          prev[0]?.serviceType || catalogData.serviceTypeCatalog[0] || "",
        quantity: nights ?? prev[0]?.quantity ?? 1,
        unitPrice: prev[0]?.unitPrice || DEFAULT_UNIT_PRICE,
      };
      return [first, ...prev.slice(1)];
    });
  };

  const clearGuestLink = () => {
    setGuestRecordId(null);
    setLinkedGuestLabel(null);
  };

  const nights = nightsBetween(checkinDate, checkoutDate);

  const totals = useMemo(
    () => computeTotals(items, parseNumber(discountAmount)),
    [items, discountAmount]
  );

  const save = useMutation(
    async () => {
      const payload: InvoiceRequest = {
        documentType,
        apartmentId: apartmentId ? Number(apartmentId) : null,
        guestRecordId,
        invoiceDate: invoiceDate || null,
        recipientName: guestName.trim(),
        recipientAddress: guestAddress.trim() || null,
        // OIB ide samo kad je račun na firmu
        recipientOib: isCompanyRecipient ? guestOib.trim() || null : null,
        recipientCountry: guestCountry.trim() || null,
        guestCount: adults,
        childrenCount: children,
        checkinDate: checkinDate || null,
        checkoutDate: checkoutDate || null,
        items: items.map((item) => ({
          unitDescription: item.unitDescription?.trim() || null,
          serviceType: item.serviceType?.trim() || null,
          roomNumber: item.roomNumber,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        discountAmount: parseNumber(discountAmount),
        paymentMethod: paymentMethod.trim() || null,
        customNotes: customNotes.trim() || null,
      };

      return isNew
        ? createInvoice(companyId, payload)
        : updateInvoice(companyId, invoice.id, payload);
    },
    { onSuccess: (saved) => saved && void onSaved(saved) }
  );

  const itemsValid =
    items.length > 0 &&
    items.every(
      (item) => Number(item.quantity) > 0 && Number(item.unitPrice) >= 0
    );

  const datesValid = !checkinDate || !checkoutDate || checkinDate < checkoutDate;

  // Račun na firmu bez OIB-a nije upotrebljiv za knjiženje
  const companyDataValid = !isCompanyRecipient || guestOib.trim().length > 0;

  const canSave =
    guestName.trim().length > 0 && itemsValid && datesValid && companyDataValid;

  const activeType = DOCUMENT_TYPES.find((t) => t.value === documentType);

  const inputClass =
    "min-h-[3rem] w-full rounded-xl border border-input bg-background px-3.5 transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40 sm:min-h-[2.5rem]";
  const labelClass = "text-sm font-medium text-foreground";

  return (
    <div className="space-y-4">
      {save.error != null && (
        <ErrorState
          error={save.error}
          context={isNew ? "Spremanje dokumenta" : "Izmjena dokumenta"}
          compact
        />
      )}

      {/* Nepotpuni podaci firme — dokument bi bio izdan bez njih */}
      {missingCompanyFields.length > 0 && (
        <div className="flex gap-2.5 rounded-xl border border-amber-500/30 bg-amber-50 px-4 py-3 dark:border-amber-500/25 dark:bg-amber-950/20">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div className="min-w-0 text-xs text-amber-800 dark:text-amber-300">
            <p className="font-semibold">Podaci firme nisu potpuni</p>
            <p className="mt-1 text-pretty">
              Nedostaje: {missingCompanyFields.map((f) => f.label).join(", ")}.
              Dokument će biti izdan bez toga i kasnija izmjena postavki ga
              neće ispraviti.
            </p>
            <Link
              href="/intranet/settings"
              className="mt-2 inline-flex min-h-[2.25rem] items-center gap-1 font-semibold text-amber-900 underline underline-offset-4 dark:text-amber-200"
            >
              Dopuni u Postavkama
            </Link>
          </div>
        </div>
      )}

      {/* --- Izdavatelj --- */}
      {showCompanyBanner && (
        <section className="rounded-2xl border border-primary/25 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground">
                Izdaje se u ime
              </p>
              <p className="mt-0.5 truncate text-base font-bold text-foreground">
                {companyName}
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground text-pretty">
                <ArrowRightLeft className="h-3.5 w-3.5 shrink-0" />
                Za drugu firmu promijenite odabir gore desno u zaglavlju.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* --- Vrsta i datum --- */}
      <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground">Vrsta dokumenta</h3>

        <div className="grid grid-cols-3 gap-2">
          {DOCUMENT_TYPES.map((type) => {
            const isActive = documentType === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => {
                  setDocumentType(type.value);
                  onDocumentTypeChange?.(type.value);
                }}
                className={cn(
                  "flex min-h-[3rem] items-center justify-center rounded-xl border px-2 text-center text-sm font-semibold transition-colors active:scale-[0.98]",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground"
                )}
              >
                {type.label}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-pretty">
          {activeType?.description}
        </p>

        <div className="space-y-2">
          <label htmlFor="invoiceDate" className={labelClass}>
            Datum dokumenta
          </label>
          <input
            id="invoiceDate"
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            className={inputClass}
          />
        </div>
      </section>

      {/* --- Gost --- */}
      <section className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">Gost</h3>

          {linkedGuestLabel || guestRecordId ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              <Link2 className="h-3 w-3" />
              Povezano
              <button
                type="button"
                onClick={clearGuestLink}
                aria-label="Ukloni vezu s gostom"
                className="ml-0.5 opacity-70 hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
        </div>

        {/* Najbrži put — popuni sve iz prijave gosta */}
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 text-sm font-semibold text-primary transition-all active:scale-[0.99]"
        >
          <UserRound className="h-4 w-4" />
          {guestRecordId ? "Promijeni gosta" : "Poveži s prijavljenim gostom"}
        </button>

        <p className="text-xs text-muted-foreground text-pretty">
          Popunjava ime, adresu, državu, apartman, datume, broj osoba i prvu
          stavku.
        </p>

        {/* Račun na firmu — otključava OIB */}
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              Račun se izdaje na firmu
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground text-pretty">
              Uključite ako gost traži račun na tvrtku ili obrt.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isCompanyRecipient}
            aria-label="Račun se izdaje na firmu"
            onClick={() => setIsCompanyRecipient((v) => !v)}
            className={cn(
              "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card",
              isCompanyRecipient ? "bg-primary" : "bg-muted-foreground/30"
            )}
          >
            <span
              className={cn(
                "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                isCompanyRecipient ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>

        <div className="space-y-2">
          <label htmlFor="guestName" className={labelClass}>
            {isCompanyRecipient ? "Naziv firme" : "Ime i prezime"}{" "}
            <span className="text-destructive">*</span>
          </label>
          <input
            id="guestName"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            autoCapitalize="words"
            placeholder={
              isCompanyRecipient ? "npr. Primjer d.o.o." : "npr. Marko Marić"
            }
            className={inputClass}
          />
        </div>

        {/* OIB — samo za račun na firmu */}
        {isCompanyRecipient && (
          <div className="space-y-2">
            <label htmlFor="guestOib" className={labelClass}>
              OIB firme <span className="text-destructive">*</span>
            </label>
            <input
              id="guestOib"
              inputMode="numeric"
              autoComplete="off"
              value={guestOib}
              onChange={(e) => setGuestOib(e.target.value)}
              placeholder="11 znamenki"
              className={cn(inputClass, "font-mono")}
            />
            {guestOib.trim().length > 0 &&
              !/^\d{11}$/.test(guestOib.trim()) && (
                <p className="text-xs text-amber-600">
                  Hrvatski OIB ima točno 11 znamenki. Za stranu firmu ovo
                  slobodno zanemarite.
                </p>
              )}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="guestAddress" className={labelClass}>
            Adresa
          </label>
          <input
            id="guestAddress"
            value={guestAddress}
            onChange={(e) => setGuestAddress(e.target.value)}
            placeholder="Ulica i grad"
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="guestCountry" className={labelClass}>
            Država
          </label>
          <input
            id="guestCountry"
            value={guestCountry}
            onChange={(e) => setGuestCountry(e.target.value)}
            placeholder="npr. Hrvatska"
            className={inputClass}
          />
        </div>
      </section>

      {/* --- Boravak --- */}
      <section className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground">Boravak</h3>

        <div className="space-y-2">
          <label htmlFor="apartmentId" className={labelClass}>
            Apartman
          </label>
          <select
            id="apartmentId"
            value={apartmentId}
            onChange={(e) => setApartmentId(e.target.value)}
            disabled={apartments.isLoading}
            className={inputClass}
          >
            <option value="">— nije odabrano —</option>
            {(apartments.data ?? []).map((apartment) => (
              <option key={apartment.id} value={apartment.id}>
                {apartment.name || apartment.internalCode}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label htmlFor="checkinDate" className={labelClass}>
              Dolazak
            </label>
            <input
              id="checkinDate"
              type="date"
              value={checkinDate}
              onChange={(e) => setCheckinDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="checkoutDate" className={labelClass}>
              Odlazak
            </label>
            <input
              id="checkoutDate"
              type="date"
              value={checkoutDate}
              onChange={(e) => setCheckoutDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {!datesValid && (
          <p className="text-xs text-destructive">
            Datum odlaska mora biti nakon dolaska.
          </p>
        )}

        {nights != null && (
          <p className="text-xs text-muted-foreground">
            Ukupno {nights} {nights === 1 ? "noć" : "noći"}.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label htmlFor="adults" className={labelClass}>
              Odraslih
            </label>
            <NumberStepper
              id="adults"
              value={adults}
              onChange={setAdults}
              min={0}
              max={30}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="children" className={labelClass}>
              Djece
            </label>
            <NumberStepper
              id="children"
              value={children}
              onChange={setChildren}
              min={0}
              max={30}
            />
          </div>
        </div>
      </section>

      {/* --- Stavke --- */}
      <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">Stavke</h3>
          <span className="text-xs text-muted-foreground">
            {items.length} {items.length === 1 ? "stavka" : "stavki"}
          </span>
        </div>

        <InvoiceItemsEditor
          items={items}
          onChange={setItems}
          currency={currency}
          catalogs={catalogData}
          onAddToCatalog={addToCatalog}
        />

        {!itemsValid && (
          <p className="text-xs text-destructive">
            Svaka stavka treba količinu veću od nule.
          </p>
        )}
      </section>

      {/* --- Iznos --- */}
      <section className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground">Iznos</h3>

        <div className="space-y-2">
          <label htmlFor="discountAmount" className={labelClass}>
            Popust
          </label>
          <div className="relative">
            <input
              id="discountAmount"
              type="number"
              inputMode="decimal"
              step="any"
              min={0}
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
              placeholder="0"
              className={cn(inputClass, "pr-14")}
            />
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {currency || "EUR"}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 rounded-xl bg-muted/50 p-3.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Zbroj stavki</span>
            <span className="font-medium text-foreground">
              {formatMoney(totals.netAmount, currency)}
            </span>
          </div>

          {totals.discountAmount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Popust</span>
              <span className="font-medium text-destructive">
                − {formatMoney(totals.discountAmount, currency)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border pt-1.5">
            <span className="text-sm font-semibold text-foreground">
              Za platiti
            </span>
            <span className="text-xl font-bold text-foreground">
              {formatMoney(totals.totalDue, currency)}
            </span>
          </div>
        </div>
      </section>

      {/* --- Plaćanje i napomena --- */}
      <section className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground">
          Plaćanje i napomena
        </h3>

        <div className="space-y-2">
          <label htmlFor="paymentMethod" className={labelClass}>
            Način plaćanja
          </label>
          <CatalogSelect
            id="paymentMethod"
            value={paymentMethod}
            onChange={setPaymentMethod}
            catalogKey="paymentMethodCatalog"
            options={catalogData.paymentMethodCatalog ?? []}
            onAddToCatalog={addToCatalog}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="customNotes" className={labelClass}>
            Napomena na dokumentu
          </label>
          <textarea
            id="customNotes"
            rows={3}
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="Tekst koji se ispisuje na dnu dokumenta..."
            className="w-full rounded-xl border border-input bg-background px-3.5 py-3 leading-relaxed transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
      </section>

      {/* --- Spremanje --- */}
      <button
        type="button"
        onClick={() => void save.run()}
        disabled={!canSave || save.isPending}
        className="inline-flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-base font-semibold text-primary-foreground transition-all active:scale-[0.99] disabled:opacity-50 sm:min-h-[3rem] sm:text-sm"
      >
        {save.isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Check className="h-5 w-5" />
        )}
        {isNew
          ? `Spremi i izdaj ${activeType?.label.toLowerCase()}`
          : "Spremi izmjene"}
      </button>

      {!canSave && (
        <p className="text-center text-xs text-muted-foreground">
          {!companyDataValid
            ? "Za račun na firmu potreban je OIB."
            : "Potrebno je ime gosta i barem jedna stavka."}
        </p>
      )}

      {isNew && canSave && (
        <p className="text-center text-xs text-muted-foreground text-pretty">
          Dokument dobiva broj i PDF odmah. Izmjene su moguće i kasnije.
        </p>
      )}

      <GuestStayPicker
        open={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={applyGuestStay}
      />
    </div>
  );
}
