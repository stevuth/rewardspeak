
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function openLoginModal() {
    // The login modal is handled by the home page client component.
    // A more robust solution might use a global state manager (like Zustand or Context),
    // but for now, we'll redirect and the homepage can handle query params if needed,
    // or the user can click the standard login button. A simple redirect is cleanest.
    window.location.href = '/'; 
}

export default function AuthVerifiedPage() {
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
                 <Link href="/" className="inline-flex items-center gap-2 mb-6">
                    <Image src="/logo.png?v=9" alt="Rewards Peak Logo" width={50} height={50} />
                    <span className="text-2xl font-bold font-headline">Rewards Peak</span>
                </Link>
            </div>
            <Card className="max-w-lg text-center animated-border-card mx-auto relative">
                <CardHeader>
                    <div className="mx-auto bg-green-500/10 text-green-400 p-4 rounded-full w-fit">
                        <ShieldCheck className="h-12 w-12" />
                    </div>
                    <CardTitle className="mt-4 font-headline text-3xl">Email Verified!</CardTitle>
                    <CardDescription className="text-base">
                        Your account has been successfully verified. You can now log in to start your journey.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={openLoginModal}>
                        Proceed to Sign In
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
