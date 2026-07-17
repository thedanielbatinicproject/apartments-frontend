import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      {/* Admin Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-zinc-800 bg-zinc-900/50">
        <div className="flex h-16 items-center border-b border-zinc-800 px-6">
          <span className="text-lg font-bold tracking-tight text-teal-400">
            Admin <span className="text-zinc-100">Šibenik</span>
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-6">
          {[
            { name: "Dashboard", href: "/admin/dashboard" },
            { name: "Solar Dashboard", href: "/admin/solar" },
            { name: "Recenzije", href: "/admin/reviews" },
            { name: "Računi", href: "/admin/invoices" },
            { name: "Uređivanje računa", href: "/admin/invoices/edit" },
            { name: "Apartmani", href: "/admin/apartments" },
            { name: "Postavke", href: "/admin/settings" }
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="flex items-center rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            >
              {item.name}
            </a>
          ))}
        </nav>
        <div className="border-t border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-200">Admin User</p>
              <a href="/" className="text-[10px] text-zinc-500 hover:text-teal-400">Natrag na web</a>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Content area */}
      <div className="flex flex-1 flex-col">
        {/* Admin Header */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900/30 px-6">
          <div className="flex items-center gap-4">
            <span className="md:hidden text-lg font-bold tracking-tight text-teal-400">
              Admin <span className="text-zinc-100">Šibenik</span>
            </span>
            <h1 className="text-sm font-semibold text-zinc-400 hidden md:block">
              Nadzorna Ploča
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-teal-950 text-teal-400 border border-teal-800/30">
              SUPER_ADMIN
            </span>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-6 md:p-8 bg-zinc-950">{children}</main>
      </div>
    </div>
  );
}
