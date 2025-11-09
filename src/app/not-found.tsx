
'use client';

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function NotFoundIllustration() {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <svg width="200" height="200" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 drop-shadow-lg">
                <defs>
                    <linearGradient id="peakGrad404" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--muted))" />
                        <stop offset="100%" stopColor="hsl(var(--border))" />
                    </linearGradient>
                    <linearGradient id="pathGrad404" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary) / 0.5)" />
                        <stop offset="100%" stopColor="hsl(var(--primary) / 0.2)" />
                    </linearGradient>
                </defs>

                {/* Background Peaks */}
                <path d="M30 200 L 100 80 L 170 200 Z" fill="url(#peakGrad404)" opacity="0.6" />
                <path d="M120 200 L 170 100 L 220 200 Z" fill="url(#peakGrad404)" />

                {/* Path */}
                <path d="M128 220 C 100 180, 140 160, 120 120 C 100 80, 150 70, 170 80" stroke="url(#pathGrad404)" strokeWidth="8" fill="none" strokeLinecap="round" />

                {/* Mascot */}
                <g transform="translate(150 50)">
                    <circle cx="28" cy="28" r="28" fill="hsl(var(--primary))" />
                    {/* Confused Eyes */}
                    <path d="M18 25 C 22 20, 26 25, 26 25" stroke="white" strokeWidth="2" fill="none" />
                    <path d="M38 25 C 42 20, 46 25, 46 25" stroke="white" strokeWidth="2" fill="none" />
                    {/* Wobbly Mouth */}
                    <path d="M28 40 Q 34 38, 40 40" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                    
                    {/* Question Mark */}
                    <text x="55" y="15" fontFamily="sans-serif" fontSize="24" fontWeight="bold" fill="hsl(var(--secondary))">?</text>
                </g>
                
                 {/* Broken Signpost */}
                <g transform="translate(60 160)">
                    <rect x="0" y="0" width="8" height="40" rx="2" fill="hsl(var(--muted-foreground))" />
                    <path d="M-20 0 L 40 0 L 35 15 L -25 15 Z" fill="hsl(var(--primary) / 0.7)" transform="rotate(-15 10 7.5)" />
                    <text x="10" y="12" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" transform="rotate(-15 10 7.5)">???</text>
                </g>

            </svg>
            <p className="font-semibold text-lg">Oops! Lost on the Trail?</p>
            <p className="text-sm">The page you're looking for seems to have vanished into the mist.</p>
        </div>
    );
}


export default function NotFound() {
  const router = useRouter();
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold mb-8">
          <Image src="/logo.png?v=9" alt="Logo" width={40} height={40} />
          <span className="text-2xl">Rewards Peak</span>
        </Link>
        <div className="text-center">
            <NotFoundIllustration />
             <Button onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back to Safety
            </Button>
        </div>
    </div>
  );
}
