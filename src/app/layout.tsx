
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { CookieConsent } from "@/components/cookie-consent";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rewards Peak - Earn Cash & Rewards Online (US & Global)",
    template: "%s | Rewards Peak",
  },
  description:
    "Join Rewards Peak to earn cash, gift cards, and crypto by completing surveys, offers, and tasks. Top-rated rewards platform for users in the USA and worldwide.",
  keywords: [
    "earn rewards",
    "make money online",
    "paid surveys",
    "cash back offers",
    "online tasks",
    "US rewards",
    "global rewards",
    "crypto rewards",
    "gift cards",
    "work from home",
    "side hustle",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rewardspeak.com",
    title: "Rewards Peak - Earn Cash & Rewards Online",
    description: "Climb to the top with every reward you earn. The best platform for paid surveys and offers in the US and globally.",
    siteName: "Rewards Peak",
    images: [
      {
        url: "https://rewardspeak.com/og-image.jpg", // Replace with actual OG image URL
        width: 1200,
        height: 630,
        alt: "Rewards Peak - Earn Rewards",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rewards Peak - Earn Cash & Rewards Online",
    description: "Join Rewards Peak to earn cash and rewards by completing simple tasks and surveys.",
    images: ["https://rewardspeak.com/og-image.jpg"], // Replace with actual OG image URL
  },
  alternates: {
    canonical: "https://rewardspeak.com",
    languages: {
      "en-US": "https://rewardspeak.com",
      "x-default": "https://rewardspeak.com",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Rewards Peak",
  url: "https://rewardspeak.com",
  logo: "https://rewardspeak.com/logo.png", // Replace with actual logo URL
  sameAs: [
    "https://twitter.com/rewardspeak",
    "https://facebook.com/rewardspeak",
    "https://instagram.com/rewardspeak",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-555-555-5555", // Replace with actual contact info if available
    contactType: "customer support",
    areaServed: ["US", "World"],
    availableLanguage: "en",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased overflow-x-hidden`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster />
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  );
}
