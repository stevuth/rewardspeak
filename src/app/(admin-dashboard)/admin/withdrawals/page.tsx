
'use client';

import { Suspense } from 'react';
import WithdrawalRequestsPageContent from './page-content';
import { WavingMascotLoader } from '@/components/waving-mascot-loader';
import type { Metadata } from 'next';

// Since this is now a client component due to Suspense, we can't export metadata directly.
// The metadata will be handled by a new server component wrapper.
function WithdrawalsPage() {
    return (
        <Suspense fallback={<div className="flex h-96 w-full items-center justify-center"><WavingMascotLoader text="Loading withdrawal requests..." /></div>}>
            <WithdrawalRequestsPageContent />
        </Suspense>
    );
}

// We'll create a new server component `page.tsx` to handle metadata and wrap this.
// For now, let's just export the component and I will create the new file structure.
export default WithdrawalsPage;
