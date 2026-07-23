"use client";

import { useState } from "react";
import {
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  Loader2,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { verifyInvoice } from "@/lib/api/invoices";
import type { InvoiceVerificationResponse } from "@/lib/api/types";
import { formatDate, formatMoney } from "@/lib/invoice-utils";
import { GuestShell } from "@/components/guest/GuestShell";
import { UidCodeInput } from "@/components/guest/UidCodeInput";

// ============================================================
// /check-invoice — javna provjera računa preko UID-a s PDF-a
// (QR kod odvodi ovamo, ili gost/porezna vlast upiše ručno).
//
// GET /api/invoices/verify?uid= (§11, javna ruta) vraća SAMO
// verifikacijske podatke, NE PDF — nema javne rute koja vraća PDF
// preko UID-a (samo admin ruta, JWT + interni ID-evi). Ovaj ekran
// zato prikazuje rezultat provjere; PDF gumb se dodaje kad backend
// doda javnu PDF rutu (zahtjev poslan, dogovoreno u razgovoru).
//
// `valid: false` ima DVA različita značenja (vidi InvoiceService.verify
// na backendu): kod ne postoji uopće (svi podaci null) NASUPROT kod
// postoji ali je račun storniran (status: CANCELLED, podaci popunjeni).
// Prikazujemo ih različito da ne zbunimo korisnika.
// ============================================================

type Phase = "input" | "result";

function buildUid(raw: string): string {
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
}

export default function CheckInvoicePage() {
  const { dict } = useLanguage();
  const t = dict.checkInvoice;

  const [phase, setPhase] = useState<Phase>("input");
  const [rawCode, setRawCode] = useState("");
  const [result, setResult] = useState<InvoiceVerificationResponse | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isComplete = rawCode.length === 8;

  const handleVerify = async () => {
    if (!isComplete || isBusy) return;
    setError(null);
    setIsBusy(true);
    try {
      const data = await verifyInvoice(buildUid(rawCode));
      setResult(data);
      setPhase("result");
    } catch (err) {
      const message =
        err instanceof Error && /fetch|network/i.test(err.message)
          ? t.errors.network
          : t.errors.generic;
      setError(message);
    } finally {
      setIsBusy(false);
    }
  };

  const reset = () => {
    setRawCode("");
    setResult(null);
    setError(null);
    setPhase("input");
  };

  const primaryBtn =
    "inline-flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 text-base font-bold text-stone-950 shadow-lg shadow-teal-500/20 transition-all active:scale-[0.98] disabled:opacity-50";

  // "notFound": kod ne postoji (svi podaci null)
  // "cancelled": kod postoji, ali račun je storniran (podaci popunjeni)
  // "valid": genuine, trenutno izdan račun
  const resultKind: "valid" | "cancelled" | "notFound" | null =
    result == null
      ? null
      : result.valid
        ? "valid"
        : result.status != null
          ? "cancelled"
          : "notFound";

  return (
    <GuestShell title={t.title}>
      {phase === "input" && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-stone-100">{t.title}</h2>
            <p className="mt-1 text-sm text-stone-400 text-pretty">
              {t.subtitle}
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 text-pretty">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <UidCodeInput
              value={rawCode}
              onChange={setRawCode}
              placeholder="E710-59DE"
              disabled={isBusy}
              autoFocus
              aria-label={t.title}
            />
            <p className="text-center text-xs text-stone-500">{t.codeHint}</p>
          </div>

          <button
            type="button"
            onClick={() => void handleVerify()}
            disabled={!isComplete || isBusy}
            className={primaryBtn}
          >
            {isBusy ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ArrowRight className="h-5 w-5" />
            )}
            {isBusy ? t.verifying : t.title}
          </button>
        </div>
      )}

      {phase === "result" && result && resultKind && (
        <div className="space-y-5">
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div
              className={
                resultKind === "valid"
                  ? "flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400"
                  : resultKind === "cancelled"
                    ? "flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 text-amber-400"
                    : "flex h-16 w-16 items-center justify-center rounded-full bg-stone-800 text-stone-400"
              }
            >
              {resultKind === "valid" ? (
                <ShieldCheck className="h-8 w-8" />
              ) : resultKind === "cancelled" ? (
                <ShieldAlert className="h-8 w-8" />
              ) : (
                <ShieldX className="h-8 w-8" />
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-stone-100">
                {resultKind === "valid"
                  ? t.result.validTitle
                  : resultKind === "cancelled"
                    ? t.result.cancelledTitle
                    : t.result.notFoundTitle}
              </h2>
              <p className="mx-auto mt-1 max-w-sm text-sm text-stone-400 text-pretty">
                {resultKind === "valid"
                  ? t.result.validText
                  : resultKind === "cancelled"
                    ? t.result.cancelledText
                    : t.result.notFoundText}
              </p>
            </div>
          </div>

          {resultKind !== "notFound" && (
            <div className="space-y-3 rounded-2xl border border-stone-700/60 bg-stone-900/60 p-4">
              <Field label={t.fields.documentNumber} value={result.documentNumber} />
              <Field label={t.fields.invoiceDate} value={formatDate(result.invoiceDate)} />
              <Field label={t.fields.issuedBy} value={result.landlordBrandName} />
              <Field label={t.fields.recipient} value={result.recipientName} />
              <Field
                label={t.fields.totalDue}
                value={
                  result.totalDue != null
                    ? formatMoney(result.totalDue, result.currency)
                    : null
                }
              />
              <Field
                label={t.fields.status}
                value={
                  result.status
                    ? (t.status[result.status as keyof typeof t.status] ??
                      result.status)
                    : null
                }
              />
            </div>
          )}

          <button type="button" onClick={reset} className={primaryBtn}>
            <RotateCcw className="h-5 w-5" />
            {t.result.checkAnother}
          </button>
        </div>
      )}
    </GuestShell>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-stone-500">{label}</span>
      <span className="min-w-0 truncate text-right font-semibold text-stone-100">
        {value}
      </span>
    </div>
  );
}
