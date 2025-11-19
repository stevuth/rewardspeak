
'use client';

import { Suspense } from 'react';
import PostbacksPageContent from './page-content';
import { WavingMascotLoader } from '@/components/waving-mascot-loader';
import type { Metadata } from 'next';

// Since this is now a client component due to Suspense, we can't export metadata directly.
// The metadata will be handled by a new server component wrapper.
// This is a common pattern for pages that need suspense.

function PostbacksPage() {
    return (
        <Suspense fallback={<div className="flex h-96 w-full items-center justify-center"><WavingMascotLoader text="Loading postbacks..." /></div>}>
            <PostbacksPageContent />
        </Suspense>
    );
}

// We'll create a new server component `page.tsx` to handle metadata and wrap this.
// For now, let's just export the component and I will create the new file structure.
export default PostbacksPage;
