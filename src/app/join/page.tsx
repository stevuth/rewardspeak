
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WavingMascotLoader } from '@/components/waving-mascot-loader';

// This page is a clean entry point for referral links.
// It opens the signup modal on the homepage.
export default function JoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Dispatch a global event that the AuthModals component on the homepage listens for.
    window.dispatchEvent(new CustomEvent('open-signup'));

    // Construct the redirect URL with existing query parameters
    const params = new URLSearchParams(searchParams.toString());
    const redirectUrl = `/?${params.toString()}`;

    // Redirect to the homepage with params. The modal will be open when the user lands there.
    router.push(redirectUrl);
  }, [router, searchParams]);

  // Show a loader while redirecting.
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <WavingMascotLoader text="Joining the climb..." />
    </div>
  );
}
