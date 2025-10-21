
import React from 'react';
import { FeaturedOfferLoader } from '@/app/featured-offer-loader';


export default async function Home() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <FeaturedOfferLoader />
        </React.Suspense>
    )
}
