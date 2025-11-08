
import React from 'react';
import { HomePageContent } from "@/app/home-page-content";
import { WavingMascotLoader } from '@/components/waving-mascot-loader';


export default async function Home() {
    return (
        <React.Suspense fallback={
            <div className="flex h-screen w-screen items-center justify-center">
                <WavingMascotLoader text="Loading..." />
            </div>
        }>
          <HomePageContent />
        </React.Suspense>
    )
}
