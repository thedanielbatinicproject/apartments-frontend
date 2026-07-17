import React from "react";

export default function EditInvoicePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-100">Uređivanje Računa</h2>
        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-red-950 text-red-400 border border-red-800/30">
          SUPER_ADMIN ONLY
        </span>
      </div>
      <p className="text-sm text-zinc-400">Izmjena izdanih dokumenata dok su u statusu DRAFT (ili storno/ispravak). Ova stranica je vidljiva isključivo SUPER_ADMIN ulogama.</p>
    </div>
  );
}
