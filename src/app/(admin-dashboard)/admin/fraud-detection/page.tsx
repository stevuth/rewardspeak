
import FraudDetectionPageWrapper from './page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Fraud Detection Center",
    description: "Review and identify potential fraudulent activity."
}

export default function FraudDetectionPage() {
    return <FraudDetectionPageWrapper />;
}
