
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from 'lucide-react';
import React from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";


export default function AuthConfirmPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen bg-background">
                <div className="text-center mb-8">
                     <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <Image src="/logo.png?v=9" alt="Rewards Peak Logo" width={50} height={50} />
                        <span className="text-2xl font-bold font-headline">Rewards Peak</span>
                    </Link>
                </div>
                <Card className="max-w-lg text-center animated-border-card">
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
                    <CardFooter className="justify-center">
                        <Link href="/">
                            <Button variant="ghost">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </React.Suspense>
    );
}
