"use client";

import { Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InvoiceItemRequest, CompanyCatalogs } from "@/lib/api/types";
import {
  formatMoney,
  lineTotal,
  parseNumber,
  DEFAULT_UNIT_PRICE,
} from "@/lib/invoice-utils";
import { NumberStepper } from "@/components/ui/number-stepper";
import { CatalogSelect } from "./CatalogSelect";

// ============================================================
// Uređivanje stavki računa.
//
// Stavke su KARTICE, ne tablica — tablica s 5 stupaca na 375px
// traži vodoravni scroll i unos brojeva u polja široka 40px.
//
// Opis jedinice i vrsta usluge biraju se iz Kataloga, a ne
// upisuju slobodno, da se isti pojam ne piše svaki put drukčije
// i da račun izgleda dosljedno.
//
// Količina ide preko + i − gumba jer je to najčešće broj noćenja
// koji se korigira za jedan-dva.
// ============================================================

interface InvoiceItemsEditorProps {
  items: InvoiceItemRequest[];
  onChange: (items: InvoiceItemRequest[]) => void;
  currency: string;
  catalogs: CompanyCatalogs;
  onAddToCatalog: (
    catalogKey: keyof CompanyCatalogs,
    value: string
  ) => Promise<void>;
  disabled?: boolean;
}

export function InvoiceItemsEditor({
  items,
  onChange,
  currency,
  catalogs,
  onAddToCatalog,
  disabled = false,
}: InvoiceItemsEditorProps) {
  const update = (index: number, patch: Partial<InvoiceItemRequest>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const addItem = () => {
    onChange([
      ...items,
      {
        unitDescription: "",
        serviceType: "",
        roomNumber: null,
        quantity: 1,
        unitPrice: DEFAULT_UNIT_PRICE,
      },
    ]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;

    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const labelClass = "text-xs font-medium text-muted-foreground";

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="space-y-3 rounded-2xl border border-border bg-background p-3.5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Stavka {index + 1}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={disabled || index === 0}
                aria-label="Pomakni gore"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors active:scale-95 disabled:opacity-30"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={disabled || index === items.length - 1}
                aria-label="Pomakni dolje"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors active:scale-95 disabled:opacity-30"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => removeItem(index)}
                disabled={disabled || items.length === 1}
                aria-label="Obriši stavku"
                title={
                  items.length === 1
                    ? "Račun mora imati barem jednu stavku"
                    : "Obriši stavku"
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-destructive transition-colors active:scale-95 disabled:opacity-30"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Opis jedinice — iz kataloga */}
          <div className="space-y-1.5">
            <label htmlFor={`item-unit-${index}`} className={labelClass}>
              Opis jedinice
            </label>
            <CatalogSelect
              id={`item-unit-${index}`}
              value={item.unitDescription ?? ""}
              onChange={(value) => update(index, { unitDescription: value })}
              catalogKey="unitDescriptionCatalog"
              options={catalogs.unitDescriptionCatalog ?? []}
              onAddToCatalog={onAddToCatalog}
              disabled={disabled}
            />
          </div>

          {/* Vrsta usluge — iz kataloga */}
          <div className="space-y-1.5">
            <label htmlFor={`item-service-${index}`} className={labelClass}>
              Vrsta usluge
            </label>
            <CatalogSelect
              id={`item-service-${index}`}
              value={item.serviceType ?? ""}
              onChange={(value) => update(index, { serviceType: value })}
              catalogKey="serviceTypeCatalog"
              options={catalogs.serviceTypeCatalog ?? []}
              onAddToCatalog={onAddToCatalog}
              disabled={disabled}
            />
          </div>

          {/* Količina — stepper */}
          <div className="space-y-1.5">
            <label htmlFor={`item-qty-${index}`} className={labelClass}>
              Količina
            </label>
            <NumberStepper
              id={`item-qty-${index}`}
              value={Number(item.quantity) || 0}
              onChange={(value) => update(index, { quantity: value })}
              min={0}
              max={365}
              allowDecimal
              disabled={disabled}
            />
          </div>

          {/* Jedinična cijena */}
          <div className="space-y-1.5">
            <label htmlFor={`item-price-${index}`} className={labelClass}>
              Jedinična cijena
            </label>
            <div className="relative">
              <input
                id={`item-price-${index}`}
                type="number"
                inputMode="decimal"
                step="any"
                min={0}
                value={item.unitPrice}
                onChange={(e) =>
                  update(index, {
                    unitPrice: parseNumber(e.target.value) ?? 0,
                  })
                }
                disabled={disabled}
                className="min-h-[3rem] w-full rounded-xl border border-input bg-background pl-3.5 pr-14 transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-50 sm:min-h-[2.5rem]"
              />
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {currency || "EUR"}
              </span>
            </div>
          </div>

          {/* Broj sobe — rijetko se koristi, pa na dnu */}
          <div className="space-y-1.5">
            <label htmlFor={`item-room-${index}`} className={labelClass}>
              Broj sobe (nije obavezno)
            </label>
            <input
              id={`item-room-${index}`}
              type="number"
              inputMode="numeric"
              value={item.roomNumber ?? ""}
              onChange={(e) =>
                update(index, { roomNumber: parseNumber(e.target.value) })
              }
              disabled={disabled}
              placeholder="—"
              className="min-h-[3rem] w-full rounded-xl border border-input bg-background px-3.5 transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-50 sm:min-h-[2.5rem]"
            />
          </div>

          <div className="flex items-center justify-between border-t border-border pt-2.5">
            <span className="text-xs text-muted-foreground">Iznos stavke</span>
            <span className="text-base font-bold text-foreground">
              {formatMoney(lineTotal(item), currency)}
            </span>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        disabled={disabled}
        className={cn(
          "inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border",
          "text-sm font-semibold text-muted-foreground transition-colors active:bg-muted disabled:opacity-50"
        )}
      >
        <Plus className="h-4 w-4" />
        Dodaj stavku
      </button>
    </div>
  );
}
