
'use client';

import { Suspense } from 'react';
import FeaturedContentPageContent from './page-content';
import { WavingMascotLoader } from '@/components/waving-mascot-loader';

export default function FeaturedContentPageWrapper() {
  return (
    <Suspense fallback={<div className="flex h-96 w-full items-center justify-center"><WavingMascotLoader text="Loading content..." /></div>}>
      <FeaturedContentPageContent />
    </Suspense>
  );
}
