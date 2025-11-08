'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already consented.
    // We run this in a try-catch block to handle potential browser restrictions on localStorage.
    try {
      if (localStorage.getItem('cookie_consent') !== 'true') {
        setIsVisible(true);
      }
    } catch (error) {
      console.error("Could not access localStorage for cookie consent:", error);
      // If localStorage is unavailable, we might still want to show the banner.
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cookie_consent', 'true');
    } catch (error) {
      console.error("Could not save cookie consent to localStorage:", error);
    }
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Cookie className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-muted-foreground">
            We use essential cookies to keep you signed in and secure. Read our{' '}
            <Link href="/privacy-trail" className="underline text-primary hover:text-primary/80">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <Button onClick={handleAccept} size="sm">
          Accept
        </Button>
      </div>
    </div>
  );
}
