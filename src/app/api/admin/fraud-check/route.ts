
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient } from "@/utils/supabase/admin";

type SuspiciousIPGroup = {
    type: 'shared_ip';
    ip_address: string;
    user_count: number;
    users: { user_id: string; user_email: string; transaction_count: number }[];
};

type SuspiciousReferralGroup = {
    type: 'suspicious_referral';
    ip_address: string;
    referrer: { user_id: string; email: string };
    referred: { user_id: string; email: string };
};

type SuspiciousGroup = SuspiciousIPGroup | SuspiciousReferralGroup;

export async function GET(request: NextRequest) {
    const supabase = createSupabaseAdminClient();
    let results: SuspiciousGroup[] = [];

    try {
        // --- CHECK 1: Users sharing the same IP address ---
        // This query finds all IP addresses that are associated with more than one distinct user_id.
        const { data: ipGroups, error: ipGroupError } = await supabase.rpc('get_ips_with_multiple_users');
        
        if (ipGroupError) throw ipGroupError;

        if (ipGroups && ipGroups.length > 0) {
             const { data: transactions, error: transactionError } = await supabase
                .from('transactions')
                .select('ip_address, user_id, user_email')
                .in('ip_address', ipGroups.map(g => g.ip_address));

            if (transactionError) throw transactionError;

            const ipUserMap = new Map<string, { user_count: number; users: { user_id: string; user_email: string; transaction_count: number }[] }>();

            for (const tx of transactions) {
                if (!tx.ip_address || !tx.user_id || !tx.user_email) continue;

                if (!ipUserMap.has(tx.ip_address)) {
                    ipUserMap.set(tx.ip_address, { user_count: 0, users: [] });
                }

                const group = ipUserMap.get(tx.ip_address)!;
                let user = group.users.find(u => u.user_id === tx.user_id);
                if (!user) {
                    user = { user_id: tx.user_id, user_email: tx.user_email, transaction_count: 0 };
                    group.users.push(user);
                    group.user_count = group.users.length;
                }
                user.transaction_count++;
            }
            
            for (const [ip, groupData] of ipUserMap.entries()) {
                if (groupData.user_count > 1) {
                    results.push({
                        type: 'shared_ip',
                        ip_address: ip,
                        user_count: groupData.user_count,
                        users: groupData.users.sort((a,b) => b.transaction_count - a.transaction_count),
                    });
                }
            }
        }
        
        return NextResponse.json({ suspicious_groups: results });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        console.error("[FRAUD-CHECK API] Error:", errorMessage);
        return NextResponse.json({ error: "Failed to perform fraud check.", details: errorMessage }, { status: 500 });
    }
}
