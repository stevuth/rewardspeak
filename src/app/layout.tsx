import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${outfit.variable} font-body antialiased overflow-x-hidden`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
