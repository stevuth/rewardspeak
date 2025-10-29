
import React from 'react';
import { HomePageContent } from "@/app/home-page-content";


export default async function Home() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <HomePageContent />
        </React.Suspense>
    )
}
