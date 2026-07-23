import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ConfirmProvider } from "@/components/ui/confirm-dialog";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const SITE_URL = "https://apartments-sibenik.com";
const SITE_NAME = "Apartments Šibenik";
const SITE_DESCRIPTION =
  "Tri obiteljska apartmana u srcu starog kamenog grada Šibenika, u kvartu Plišac — na kratkoj šetnji od mora, tvrđava i katedrale. Domaćini Brigita i Ivica dočekuju goste osobno.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — apartmani u starom gradu`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — apartmani u starom gradu`,
    description: SITE_DESCRIPTION,
    locale: "hr_HR",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — apartmani u starom gradu`,
    description: SITE_DESCRIPTION,
  },
  // PWA-like ponašanje kad korisnik doda stranicu na home screen iPhonea
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    // Sprječava iOS da automatski pretvara brojeve u telefonske linkove
    telephone: false,
  },
};

// Mobile-first viewport.
// - viewportFit: "cover" → sadržaj ide ispod notcha, a mi ga kontroliramo
//   preko env(safe-area-inset-*) utilities iz globals.css
// - userScalable ostaje true: nikad ne oduzimamo korisniku mogućnost zumiranja
//   (iOS auto-zoom na inpute rješavamo font-size: 16px pravilom, ne zabranom)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
};

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AuthProvider>
            {/* ConfirmProvider je u root layoutu da i javne stranice
                mogu koristiti dijalog umjesto window.confirm */}
            <ConfirmProvider>{children}</ConfirmProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
