
'use client';

import { Suspense } from 'react';
import PostbacksPageContent from './page-content';
import { WavingMascotLoader } from '@/components/waving-mascot-loader';

export default function PostbacksPageWrapper() {
    return (
        <Suspense fallback={<div className="flex h-96 w-full items-center justify-center"><WavingMascotLoader text="Loading postbacks..." /></div>}>
            <PostbacksPageContent />
        </Suspense>
    );
}
