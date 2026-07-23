import type { MetadataRoute } from "next";

const BASE_URL = "https://apartments-sibenik.com";

// Apartmani su fiksno 3 (id 1-3, vidi AIRBNB_LISTINGS u airbnb-links.ts) —
// nemamo javni backend endpoint za popis ID-ova bez fetcha na build-u,
// pa su ovdje ručno navedeni.
const APARTMENT_IDS = [1, 2, 3];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: BASE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: `${BASE_URL}/apartmani`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...APARTMENT_IDS.map((id) => ({
      url: `${BASE_URL}/apartmani/${id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: `${BASE_URL}/o-sibeniku`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/kontakt`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
