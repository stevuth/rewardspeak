
import OfferPreviewPageWrapper from './page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Offer Preview",
    description: "See how featured and all enabled offers are displayed to users."
}

export default function OfferPreviewPage() {
    return <OfferPreviewPageWrapper />;
}
