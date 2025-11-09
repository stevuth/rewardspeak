
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WavingMascotLoader } from '@/components/waving-mascot-loader';
import { Badge } from '@/components/ui/badge';
import { User, Fingerprint, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type SuspiciousUser = {
    user_id: string;
    user_email: string;
    transaction_count: number;
};

type SuspiciousIPGroup = {
    type: 'shared_ip';
    ip_address: string;
    user_count: number;
    users: SuspiciousUser[];
};

type SuspiciousGroup = SuspiciousIPGroup;

export default function FraudDetectionPage() {
    const [suspiciousGroups, setSuspiciousGroups] = useState<SuspiciousGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchFraudData() {
            setIsLoading(true);
            try {
                const response = await fetch('/api/admin/fraud-check');
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.details || 'Failed to fetch fraud detection data.');
                }
                const data = await response.json();
                setSuspiciousGroups(data.suspicious_groups || []);
            } catch (error) {
                console.error("Error fetching fraud data:", error);
                toast({
                    variant: 'destructive',
                    title: 'Error Loading Data',
                    description: error instanceof Error ? error.message : "An unknown error occurred.",
                });
            } finally {
                setIsLoading(false);
            }
        }
        fetchFraudData();
    }, [toast]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <WavingMascotLoader text="Scanning for suspicious activity..." />
            </div>
        );
    }

    const sharedIpGroups = suspiciousGroups.filter(g => g.type === 'shared_ip');

    return (
        <div className="space-y-8">
            <PageHeader
                title="Fraud Detection Center"
                description="This tool identifies potential fraudulent activity, such as multiple users on one IP address."
                icon={ShieldAlert}
            />
            {sharedIpGroups.length > 0 ? (
                <div>
                    <h2 className="text-xl font-semibold tracking-tight mb-4">Shared IP Addresses</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {sharedIpGroups.map(group => (
                            <Card key={group.ip_address} className="border-destructive/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Fingerprint className="text-destructive" />
                                        IP: {group.ip_address}
                                    </CardTitle>
                                    <CardDescription>
                                        <Badge variant="destructive">{group.user_count} users</Badge> sharing this IP address.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {group.users.map(user => (
                                        <div key={user.user_id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <span className="text-sm font-medium truncate" title={user.user_email}>
                                                    {user.user_email}
                                                </span>
                                            </div>
                                            <Badge variant="secondary">{user.transaction_count} txns</Badge>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">No suspicious activity detected at this time.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
