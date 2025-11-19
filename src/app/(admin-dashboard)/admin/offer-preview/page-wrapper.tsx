
'use client';

import { Suspense } from 'react';
import OfferPreviewPageContent from './page-content';
import { WavingMascotLoader } from '@/components/waving-mascot-loader';

export default function OfferPreviewPageWrapper() {
  return (
    <Suspense fallback={<div className="flex h-96 w-full items-center justify-center"><WavingMascotLoader text="Loading offer previews..." /></div>}>
      <OfferPreviewPageContent />
    </Suspense>
  );
}
