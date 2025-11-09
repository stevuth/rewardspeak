
'use client';

import Image from 'next/image';
import { useActionState, useEffect } from 'react';
import { supportLogin } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Lock, Mail, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function SupportLoginPage() {
  const [state, formAction, isPending] = useActionState(supportLogin, { message: "", success: false });
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.success) {
      toast({
        variant: 'destructive',
        title: "Login Failed",
        description: state.message,
      });
    }
    if (state.success) {
        // This redirect is now handled by the server action itself.
        // The client-side redirect can be removed.
    }
  }, [state, toast]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="absolute top-4 left-4">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold">
          <Image src="/logo.png?v=9" alt="Logo" width={32} height={32} />
          <span className="text-xl">Rewards Peak</span>
        </Link>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <LifeBuoy className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="text-2xl font-bold font-headline">Support Portal</CardTitle>
          <CardDescription>Enter your agent credentials to access the helpdesk.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
               <div className="relative">
                 <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" name="email" type="email" placeholder="support-agent@rewardspeak.com" required className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
               <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" name="password" type="password" required className="pl-10" />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
