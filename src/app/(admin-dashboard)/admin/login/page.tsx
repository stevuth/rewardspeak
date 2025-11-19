
'use client';

import Image from 'next/image';
import { useActionState, useEffect } from 'react';
import { adminLogin } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Mail, Shield, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { WavingMascotLoader } from '@/components/waving-mascot-loader';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(adminLogin, { message: "", success: false });
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: "Login Successful",
          description: "Redirecting to the admin dashboard...",
        });
        router.push('/admin/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: "Login Failed",
          description: state.message,
        });
      }
    }
  }, [state, toast, router]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="w-full lg:grid lg:grid-cols-2">
        {/* Left Panel */}
        <div className="relative hidden flex-col items-center justify-between bg-card p-8 text-white lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background" />
           <Link href="/" className="relative z-10 inline-flex items-center gap-2 self-start font-semibold">
            <Image src="/logo.png?v=9" alt="Logo" width={32} height={32} />
            <span className="text-xl">Rewards Peak</span>
          </Link>
          <div className="relative z-10 my-auto flex flex-col items-center text-center">
            <div className="mb-6 rounded-full bg-primary/10 p-4">
              <Shield className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold font-headline">Administrative Portal</h1>
            <p className="mt-2 text-muted-foreground">Restricted access for authorized personnel only.</p>
          </div>
          <div className="relative z-10 mt-auto flex w-full max-w-sm items-start gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-left">
            <AlertTriangle className="h-6 w-6 flex-shrink-0 text-destructive" />
            <div>
                <h3 className="font-semibold text-destructive-foreground">Security Warning</h3>
                <p className="text-sm text-destructive/80">
                All activities on this portal are logged and monitored for security purposes. Unauthorized access is strictly prohibited.
                </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex items-center justify-center p-4">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold font-headline">Admin Sign In</h1>
              <p className="text-muted-foreground">Enter your credentials to access the control panel.</p>
            </div>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" name="email" type="email" placeholder="admin@rewardspeak.com" required className="pl-10" />
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

    