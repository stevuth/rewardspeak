
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ResetPasswordConfirmPage() {
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
                    <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit">
                        <KeyRound className="h-12 w-12" />
                    </div>
                    <CardTitle className="mt-4 font-headline text-3xl">Password Updated</CardTitle>
                    <CardDescription className="text-base">
                        Your password has been successfully reset. You can now log in with your new credentials.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                         <Link href="/">
                            Return to Sign In
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

