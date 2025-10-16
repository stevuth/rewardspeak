
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Info, Rocket, ShieldCheck } from 'lucide-react';

const toastStyles = {
  success: {
    icon: <CheckCircle className="text-green-500" />,
    style: {
      borderColor: 'hsl(var(--primary))',
      color: 'hsl(var(--foreground))',
    },
  },
  info: {
    icon: <Info className="text-blue-500" />,
    style: {},
  },
  welcome: {
    icon: <Rocket className="text-primary" />,
     style: {
      borderColor: 'hsl(var(--primary))',
      color: 'hsl(var(--foreground))',
    },
  },
  verified: {
      icon: <ShieldCheck className="text-green-500" />,
      style: {
        borderColor: 'hsl(var(--green-500))',
        color: 'hsl(var(--foreground))',
      }
  }
};


export function AuthToastProvider() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const login = searchParams.get('login');
    const verified = searchParams.get('verified');
    const signup = searchParams.get('signup');

    if (login) {
      toast({
        ...toastStyles.welcome,
        title: 'Welcome Back!',
        description: "You've successfully logged in. Let's get earning!",
      });
    }

    if (verified) {
      toast({
        ...toastStyles.verified,
        title: 'Account Verified!',
        description: "Your email has been confirmed. Welcome to Rewards Peak!",
      });
    }

    if (signup) {
      toast({
        ...toastStyles.success,
        title: 'One last step...',
        description: 'We sent a verification link to your email. Please check your inbox.',
      });
    }
  }, [searchParams]);

  return null; // This component doesn't render anything itself
}
