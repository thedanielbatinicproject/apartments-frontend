import { IntranetSidebar } from "./IntranetSidebar";
import { IntranetHeader } from "./IntranetHeader";

export function IntranetShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — fiksiran, ne scrolla */}
      <IntranetSidebar />

      {/* Desna strana */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <IntranetHeader />

        {/* Scrollabilni sadržaj */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
