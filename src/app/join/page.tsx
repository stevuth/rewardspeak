
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WavingMascotLoader } from '@/components/waving-mascot-loader';

// This page is a clean entry point for referral links.
// It opens the signup modal on the homepage.
export default function JoinPage() {
  const router = useRouter();

  useEffect(() => {
    // Dispatch a global event that the AuthModals component on the homepage listens for.
    window.dispatchEvent(new CustomEvent('open-signup'));
    // Redirect to the homepage. The modal will be open when the user lands there.
    router.push('/');
  }, [router]);

  // Show a loader while redirecting.
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <WavingMascotLoader text="Joining the climb..." />
    </div>
  );
}
