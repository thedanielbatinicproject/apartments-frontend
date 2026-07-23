"use client";

import { AirbnbEmbed } from "./AirbnbEmbed";
import type { AirbnbListing } from "@/lib/airbnb-links";

interface AirbnbCardLabels {
  title: string;
  text: string;
  viewOnAirbnb: string;
  tapHint: string;
  unavailable: string;
}

interface AirbnbCardProps {
  listing: AirbnbListing | null;
  apartmentName: string;
  labels: AirbnbCardLabels;
}

export function AirbnbCard({ listing, apartmentName, labels }: AirbnbCardProps) {
  return (
    <div
      className="flex flex-col rounded-3xl p-5 sm:p-6"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklab, #ff385c 10%, var(--hs-card)), var(--hs-card))",
        border: "1px solid color-mix(in oklab, #ff385c 25%, transparent)",
      }}
    >
      <h3 className="text-lg font-semibold [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
        {labels.title}
      </h3>
      <p className="mt-1 text-sm [color:var(--hs-text-soft)]">{labels.text}</p>

      {listing ? (
        <>
          <div className="mt-4">
            <AirbnbEmbed
              roomId={listing.roomId}
              fallbackHref={listing.url}
              viewOnAirbnbLabel={labels.viewOnAirbnb}
              fallbackSummary={apartmentName}
            />
          </div>
          <p className="mt-3 text-center text-xs opacity-70 [color:var(--hs-text-soft)]">
            {labels.tapHint}
          </p>
        </>
      ) : (
        <p className="mt-4 text-sm [color:var(--hs-text-soft)] opacity-80">
          {labels.unavailable}
        </p>
      )}
    </div>
  );
}
