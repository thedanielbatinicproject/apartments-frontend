"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface PhotoFrameProps {
  src: string;
  alt: string;
  className?: string;
}

/** <img> s gracioznim fallbackom (u dnevnoj paleti) ako fotografija još nije dodana u public/images/sibenik/. */
export function PhotoFrame({ src, alt, className = "" }: PhotoFrameProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{
          background:
            "linear-gradient(135deg, var(--hs-sky-mid), var(--hs-sea-far) 60%, var(--hs-sea-near))",
        }}
      >
        <ImageOff className="h-8 w-8 text-white/50" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
