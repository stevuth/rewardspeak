
import PostbacksPageWrapper from './page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Postback History",
    description: "View a complete log of all offer completion postbacks."
}

export default function PostbacksPage() {
    return <PostbacksPageWrapper />;
}
