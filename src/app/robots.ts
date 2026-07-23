import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/intranet",
        "/checkin",
        "/check-invoice",
        "/accept-invite",
        "/reset-password",
      ],
    },
    sitemap: "https://apartments-sibenik.com/sitemap.xml",
  };
}
