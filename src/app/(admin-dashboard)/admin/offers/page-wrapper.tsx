
'use client';

import { Suspense } from 'react';
import ManageOffersPage from './page-content';
import { WavingMascotLoader } from '@/components/waving-mascot-loader';

export default function OffersPageWrapper() {
  return (
    <Suspense fallback={<div className="flex h-96 w-full items-center justify-center"><WavingMascotLoader text="Loading offers page..." /></div>}>
      <ManageOffersPage />
    </Suspense>
  );
}
