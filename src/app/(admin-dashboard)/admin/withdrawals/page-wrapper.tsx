
'use client';

import { Suspense } from 'react';
import WithdrawalRequestsPageContent from './page-content';
import { WavingMascotLoader } from '@/components/waving-mascot-loader';

export default function WithdrawalsPageWrapper() {
    return (
        <Suspense fallback={<div className="flex h-96 w-full items-center justify-center"><WavingMascotLoader text="Loading withdrawal requests..." /></div>}>
            <WithdrawalRequestsPageContent />
        </Suspense>
    );
}
