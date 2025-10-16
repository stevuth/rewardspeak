'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { LoginPageContent } from '@/components/auth/login-page-content';
import DashboardPage from '@/app/(dashboard)/page';

export default function Page() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    // This avoids the hydration mismatch.
    if (!isUserLoading && user) {
      // If the user is loaded and authenticated, go to the dashboard.
      // Since this component might be the dashboard itself, we check the path.
      // A more robust solution might use layouts, but this prevents a loop.
      if (window.location.pathname !== '/dashboard') {
         router.replace('/dashboard');
      }
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user) {
    // If the user is logged in, show the dashboard.
    // This is the state after the client-side check.
    return <DashboardPage />;
  }

  // If no user and not loading, show the login page.
  // This is the default server-rendered state and the client state for logged-out users.
  return <LoginPageContent />;
}
