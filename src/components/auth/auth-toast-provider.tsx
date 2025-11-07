
"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Info, Rocket, Gift } from 'lucide-react';

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
      icon: <Gift className="text-yellow-400" />,
      style: {
        borderColor: 'hsl(var(--yellow-400))',
        color: 'hsl(var(--foreground))',
      }
  }
};


export function AuthToastProvider() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const signup = searchParams.get('signup');

    if (signup) {
      toast({
        ...toastStyles.success,
        title: 'One last step...',
        description: 'We sent a verification link to your email. Please check your inbox.',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null; // This component doesn't render anything itself
}
