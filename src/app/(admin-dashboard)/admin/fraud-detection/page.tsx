
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WavingMascotLoader } from '@/components/waving-mascot-loader';
import { Badge } from '@/components/ui/badge';
import { User, Fingerprint, Link as LinkIcon } from 'lucide-react';
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

type SuspiciousReferralGroup = {
    type: 'suspicious_referral';
    ip_address: string;
    referrer: { user_id: string; email: string };
    referred: { user_id: string; email: string };
};

type SuspiciousGroup = SuspiciousIPGroup | SuspiciousReferralGroup;

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
                    throw new Error('Failed to fetch fraud detection data.');
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

    const sharedIpGroups = suspiciousGroups.filter(g => g.type === 'shared_ip') as SuspiciousIPGroup[];
    const referralGroups = suspiciousGroups.filter(g => g.type === 'suspicious_referral') as SuspiciousReferralGroup[];

    return (
        <div className="space-y-8">
            <PageHeader
                title="Fraud Detection Center"
                description="This tool identifies potential fraudulent activity, such as multiple users on one IP or self-referrals."
            />
            {suspiciousGroups.length > 0 ? (
                <div className='space-y-8'>
                    {referralGroups.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight mb-4">Suspicious Referral Chains</h2>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {referralGroups.map((group, index) => (
                                    <Card key={`ref-${index}`} className="border-destructive/50">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <LinkIcon className="text-destructive" />
                                                IP: {group.ip_address}
                                            </CardTitle>
                                            <CardDescription>
                                                Referrer and new user share an IP.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <p className='text-xs font-semibold text-muted-foreground'>Referrer:</p>
                                            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md overflow-hidden">
                                                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <span className="text-sm font-medium truncate" title={group.referrer.email}>
                                                    {group.referrer.email}
                                                </span>
                                            </div>
                                            <p className='text-xs font-semibold text-muted-foreground mt-2'>Referred User:</p>
                                            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md overflow-hidden">
                                                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <span className="text-sm font-medium truncate" title={group.referred.email}>
                                                    {group.referred.email}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                    {sharedIpGroups.length > 0 && (
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
                    )}
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
