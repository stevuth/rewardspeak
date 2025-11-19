
import OffersPageWrapper from './page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Manage Offers",
    description: "Sync, filter, and manage all available offers."
}

export default function OffersPage() {
    return <OffersPageWrapper />;
}
