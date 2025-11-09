
'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const AuthErrorIllustration = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <svg width="128" height="128" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 drop-shadow-lg">
            <defs>
                <linearGradient id="gateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--destructive))" />
                    <stop offset="100%" stopColor="hsl(var(--destructive) / 0.6)" />
                </linearGradient>
                <linearGradient id="lockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--muted))" />
                    <stop offset="100%" stopColor="hsl(var(--border))" />
                </linearGradient>
            </defs>

            {/* Gate Structure */}
            <rect x="60" y="80" width="136" height="100" rx="8" fill="none" stroke="url(#gateGrad)" strokeWidth="8"/>
            <line x1="128" y1="80" x2="128" y2="180" stroke="url(#gateGrad)" strokeWidth="8" />
            <line x1="60" y1="130" x2="196" y2="130" stroke="url(#gateGrad)" strokeWidth="6" />

            {/* Lock */}
            <g transform="translate(104 115)">
                 <rect x="0" y="10" width="48" height="30" rx="5" fill="url(#lockGrad)" />
                 <path d="M24 10 V0 A12 12 0 0 1 36 12 V10" stroke="url(#lockGrad)" strokeWidth="6" fill="none" />
                 <circle cx="24" cy="25" r="4" fill="hsl(var(--background))" />
            </g>

            {/* Mascot */}
             <g transform="translate(160 140)">
                <circle cx="28" cy="28" r="28" fill="hsl(var(--primary))" />
                {/* Worried Eyes */}
                <path d="M18 22 C 22 26, 26 22, 26 22" stroke="white" strokeWidth="2" fill="none" />
                <path d="M38 22 C 42 26, 46 22, 46 22" stroke="white" strokeWidth="2" fill="none" />
                 {/* Sad Mouth */}
                <path d="M28 40 Q 34 36, 40 40" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
        </svg>
    </div>
);


export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message') || "An unknown error occurred. Please try again.";

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <Card className="max-w-lg text-center">
                <CardHeader>
                    <AuthErrorIllustration />
                    <CardTitle className="mt-4 text-2xl font-bold">Access Denied</CardTitle>
                    <CardDescription>
                        {message}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/">
                            Return to Homepage
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
