"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// ============================================================
// Portal na document.body.
//
// ZAŠTO POSTOJI: `position: fixed` se NE pozicionira prema
// viewportu ako bilo koji predak ima transform, filter ili
// backdrop-filter — taj predak postaje containing block.
//
// Naš sticky header ima backdrop-blur, pa je "fullscreen"
// popup jezika renderiran unutar headera visokog 56 px:
// na desktopu odsječen, na mobitelu praktički nevidljiv.
//
// Portal izmješta sadržaj izvan takvih predaka. Renderira se
// tek nakon mounta (SSR nema document), pa nema hydration
// mismatcha.
// ============================================================

export function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}
