
'use client';

import { Suspense } from 'react';
import ManageUsersPageContent from './page-content';
import { WavingMascotLoader } from '@/components/waving-mascot-loader';
import type { Metadata } from 'next';

// We can't export metadata from a client component.
// It should be moved to a server component parent if needed, or defined in a new page.tsx.
// For now, let's create a wrapper.

function UsersPage() {
    return (
        <Suspense fallback={<div className="flex h-96 w-full items-center justify-center"><WavingMascotLoader text="Loading users..." /></div>}>
            <ManageUsersPageContent />
        </Suspense>
    );
}

export default UsersPage;
