
'use client';

import Image from 'next/image';
import { useActionState, useEffect } from 'react';
import { supportLogin } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Mail, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import { WavingMascotLoader } from '@/components/waving-mascot-loader';

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
  }, [state, toast]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="w-full lg:grid lg:grid-cols-2">
        {/* Left Panel */}
        <div className="relative hidden flex-col items-center justify-center bg-card p-8 text-white lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background" />
           <Link href="/" className="absolute top-8 left-8 z-10 inline-flex items-center gap-2 self-start font-semibold">
            <Image src="/logo.png?v=9" alt="Logo" width={32} height={32} />
            <span className="text-xl">Rewards Peak</span>
          </Link>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-6 rounded-full bg-primary/10 p-4">
              <LifeBuoy className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold font-headline">Support Portal</h1>
            <p className="mt-2 text-muted-foreground">Agent access for managing user inquiries.</p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex items-center justify-center p-4">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold font-headline">Agent Sign In</h1>
              <p className="text-muted-foreground">Enter your credentials to access the helpdesk.</p>
            </div>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" name="email" type="email" placeholder="agent@rewardspeak.com" required className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" name="password" type="password" required className="pl-10" />
                </div>
              </div>
              <Button type="submit" className="w-full font-bold" disabled={isPending}>
                {isPending ? (
                  <WavingMascotLoader messages={["Signing In..."]} />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
             <div className="text-center text-sm text-muted-foreground">
                <Link href="/" className="underline hover:text-primary">
                    Return to main site
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
