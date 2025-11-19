
import FeaturedContentPageWrapper from './page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Manage Featured Content",
    description: "Manually set the offers that appear in the 'Featured' and 'Top Converting' sections."
}

export default function FeaturedContentPage() {
    return <FeaturedContentPageWrapper />;
}
