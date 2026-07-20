"use client";

import Link from "next/link";
import { Building2, User, CalendarRange, Link2, Hash } from "lucide-react";
import type { InvoiceResponse } from "@/lib/api/types";
import {
  formatDate,
  formatMoney,
  nightsBetween,
} from "@/lib/invoice-utils";

// ============================================================
// Read-only prikaz izdanog dokumenta.
//
// Prikazuje SNIMKU podataka firme (landlord*) iz trenutka
// izdavanja, a ne trenutne podatke firme — tako izgleda i PDF.
// Ako se firmi kasnije promijeni npr. IBAN, stari račun i dalje
// pokazuje onaj koji je bio na njemu.
// ============================================================

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (value == null || value === "") return null;

  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right text-sm text-foreground break-anywhere">
        {value}
      </span>
    </div>
  );
}

export function InvoiceDetailView({ invoice }: { invoice: InvoiceResponse }) {
  const nights = nightsBetween(invoice.checkinDate, invoice.checkoutDate);

  return (
    <div className="space-y-4">
      {/* Izdavatelj — snimka */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          Izdavatelj
        </h3>
        <div className="mt-2 divide-y divide-border">
          <Row label="Naziv" value={invoice.landlordBrandName} />
          <Row label="Vlasnik" value={invoice.landlordOwnerName} />
          <Row label="OIB" value={invoice.landlordOib} />
          <Row
            label="Adresa"
            value={
              [
                invoice.landlordAddress,
                [invoice.landlordPostalCode, invoice.landlordCity]
                  .filter(Boolean)
                  .join(" "),
                invoice.landlordCountry,
              ]
                .filter(Boolean)
                .join(", ") || null
            }
          />
          <Row label="Telefon" value={invoice.landlordPhone} />
          <Row label="Email" value={invoice.landlordEmail} />
          <Row label="Banka" value={invoice.landlordBankName} />
          <Row
            label="IBAN"
            value={
              invoice.landlordIban ? (
                <span className="font-mono text-xs">{invoice.landlordIban}</span>
              ) : null
            }
          />
          <Row label="SWIFT" value={invoice.landlordSwift} />
          <Row label="Potpisnik" value={invoice.landlordSignatory} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground text-pretty">
          Podaci su zabilježeni u trenutku izdavanja i ne mijenjaju se ako firma
          kasnije promijeni podatke.
        </p>
      </section>

      {/* Primatelj */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <User className="h-4 w-4 text-muted-foreground" />
          Primatelj
        </h3>
        <div className="mt-2 divide-y divide-border">
          <Row label="Naziv" value={invoice.recipientName} />
          <Row label="Adresa" value={invoice.recipientAddress} />
          <Row label="OIB / VAT" value={invoice.recipientOib} />
          <Row label="Država" value={invoice.recipientCountry} />
        </div>
      </section>

      {/* Boravak */}
      {(invoice.checkinDate ||
        invoice.checkoutDate ||
        invoice.guestCount != null ||
        invoice.apartmentId != null) && (
        <section className="rounded-2xl border border-border bg-card p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CalendarRange className="h-4 w-4 text-muted-foreground" />
            Boravak
          </h3>
          <div className="mt-2 divide-y divide-border">
            {invoice.apartmentId != null && (
              <Row
                label="Apartman"
                value={
                  <Link
                    href={`/intranet/apartments/${invoice.apartmentId}`}
                    className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                  >
                    {invoice.apartmentInternalCode ?? `#${invoice.apartmentId}`}
                    <Link2 className="h-3 w-3" />
                  </Link>
                }
              />
            )}
            <Row label="Dolazak" value={formatDate(invoice.checkinDate)} />
            <Row label="Odlazak" value={formatDate(invoice.checkoutDate)} />
            {nights != null && (
              <Row
                label="Noćenja"
                value={`${nights} ${nights === 1 ? "noć" : "noći"}`}
              />
            )}
            <Row
              label="Gostiju"
              value={
                invoice.guestCount != null
                  ? `${invoice.guestCount} odraslih${
                      invoice.childrenCount ? `, ${invoice.childrenCount} djece` : ""
                    }`
                  : null
              }
            />
          </div>
        </section>
      )}

      {/* Stavke */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground">Stavke</h3>

        <ul className="mt-3 space-y-2">
          {[...invoice.items]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-border bg-background p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {item.unitDescription || item.serviceType || "Stavka"}
                    </p>
                    {item.unitDescription && item.serviceType && (
                      <p className="text-xs text-muted-foreground">
                        {item.serviceType}
                      </p>
                    )}
                    {item.roomNumber != null && (
                      <p className="text-xs text-muted-foreground">
                        Soba {item.roomNumber}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-sm font-bold text-foreground">
                    {formatMoney(item.lineTotal, invoice.currency)}
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-muted-foreground">
                  {item.quantity} × {formatMoney(item.unitPrice, invoice.currency)}
                </p>
              </li>
            ))}
        </ul>

        {/* Zbroj */}
        <div className="mt-3 space-y-1.5 rounded-xl bg-muted/50 p-3.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Osnovica</span>
            <span className="font-medium text-foreground">
              {formatMoney(invoice.netAmount, invoice.currency)}
            </span>
          </div>

          {invoice.discountAmount != null && invoice.discountAmount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Popust</span>
              <span className="font-medium text-destructive">
                − {formatMoney(invoice.discountAmount, invoice.currency)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border pt-1.5">
            <span className="text-sm font-semibold text-foreground">
              Za platiti
            </span>
            <span className="text-lg font-bold text-foreground">
              {formatMoney(invoice.totalDue, invoice.currency)}
            </span>
          </div>
        </div>
      </section>

      {/* Plaćanje, napomena, UID */}
      {(invoice.paymentMethod || invoice.customNotes || invoice.uid) && (
        <section className="rounded-2xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground">Ostalo</h3>
          <div className="mt-2 divide-y divide-border">
            <Row label="Način plaćanja" value={invoice.paymentMethod} />
            <Row
              label="UID"
              value={
                invoice.uid ? (
                  <span className="inline-flex items-center gap-1 font-mono text-xs">
                    <Hash className="h-3 w-3" />
                    {invoice.uid}
                  </span>
                ) : null
              }
            />
          </div>

          {invoice.customNotes && (
            <div className="mt-3 rounded-xl bg-muted/50 p-3">
              <p className="text-xs whitespace-pre-wrap text-muted-foreground">
                {invoice.customNotes}
              </p>
            </div>
          )}

          {invoice.uid && (
            <p className="mt-2 text-xs text-muted-foreground text-pretty">
              UID služi za javnu provjeru autentičnosti dokumenta preko QR koda
              na PDF-u.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
