
import WithdrawalsPageWrapper from './page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Manage Withdrawals",
    description: "Approve, reject, and manage all user withdrawal requests."
}

export default function WithdrawalsPage() {
    return <WithdrawalsPageWrapper />;
}
