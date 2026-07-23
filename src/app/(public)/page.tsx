import { HomeFlow } from "@/components/public/home/HomeFlow";

// ============================================================
// Naslovnica — scenično iskustvo bez klasičnog headera: jedan
// kontinuirani flow (hero → apartmani → o-Šibeniku → kontakt),
// vidi HomeFlow.tsx. Fraunces (--font-display) dolazi iz
// (public)/layout.tsx — dijeli ga cijeli javni dio.
// ============================================================

export default function HomePage() {
  return <HomeFlow />;
}
