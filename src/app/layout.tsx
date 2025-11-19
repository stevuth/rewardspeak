
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
    default: "Rewards Peak",
    template: "%s | Rewards Peak",
  },
  description:
    "Climb to the top with every reward you earn. Earn rewards by completing tasks and offers. Make money online from anywhere.",
  keywords: [
    "earn rewards",
    "make money online",
    "reward offers",
    "Nigeria",
    "global users",
    "paid surveys",
    "online tasks",
  ],
  icons: {
    icon: '/favicon.ico',
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
        {children}
        <Toaster />
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  );
}
