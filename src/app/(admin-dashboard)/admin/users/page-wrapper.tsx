
'use client';

import { Suspense } from 'react';
import ManageUsersPageContent from './page-content';
import { WavingMascotLoader } from '@/components/waving-mascot-loader';

export default function UsersPageWrapper() {
    return (
        <Suspense fallback={<div className="flex h-96 w-full items-center justify-center"><WavingMascotLoader text="Loading user filters..." /></div>}>
            <ManageUsersPageContent />
        </Suspense>
    )
}
