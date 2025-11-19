
import UsersPageWrapper from './page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Manage Users",
    description: "View, filter, and manage all registered users on the platform."
}

export default function UsersPage() {
    return <UsersPageWrapper />;
}
