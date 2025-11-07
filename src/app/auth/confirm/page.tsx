'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck, X } from 'lucide-react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthConfirmPage() {
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
                 <Link href="/" className="inline-flex items-center gap-2 mb-6">
                    <Image src="/logo.png?v=9" alt="Rewards Peak Logo" width={50} height={50} />
                    <span className="text-2xl font-bold font-headline">Rewards Peak</span>
                </Link>
            </div>
            <Card className="max-w-lg text-center animated-border-card mx-auto relative">
                <Link href="/" aria-label="Close">
                    <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </Button>
                </Link>
                <CardHeader>
                    <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit">
                        <MailCheck className="h-12 w-12" />
                    </div>
                    <CardTitle className="mt-4 font-headline text-3xl">Confirm Your Email</CardTitle>
                    <CardDescription className="text-base">
                        We've sent a verification link to your email address. Please check your inbox (and spam folder) to complete your registration.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Once you've verified your email, you'll be ready to start earning.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
