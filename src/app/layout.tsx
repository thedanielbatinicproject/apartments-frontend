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

export const metadata: Metadata = {
  title: "Apartments Šibenik",
  description: "Apartments Šibenik - Dobrodošli u apartmane Šibenik!",
  // PWA-like ponašanje kad korisnik doda stranicu na home screen iPhonea
  appleWebApp: {
    capable: true,
    title: "Apartments Šibenik",
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
