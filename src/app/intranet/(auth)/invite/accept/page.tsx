"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AcceptInviteForm } from "@/components/intranet/auth/AcceptInviteForm";

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="w-full max-w-sm">
        <AcceptInviteForm token={token} />
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense>
      <AcceptInviteContent />
    </Suspense>
  );
}
