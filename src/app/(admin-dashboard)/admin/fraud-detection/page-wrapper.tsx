
'use client';

import { Suspense } from 'react';
import FraudDetectionPageContent from './page-content';
import { WavingMascotLoader } from '@/components/waving-mascot-loader';

export default function FraudDetectionPageWrapper() {
  return (
    <Suspense fallback={<div className="flex h-96 w-full items-center justify-center"><WavingMascotLoader text="Loading Fraud Center..." /></div>}>
      <FraudDetectionPageContent />
    </Suspense>
  );
}
