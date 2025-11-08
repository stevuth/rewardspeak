
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
        // --- CHECK 1: Users sharing the same IP address (Simplified Logic) ---

        // 1. Fetch all transactions with necessary info.
        const { data: transactions, error: transactionError } = await supabase
            .from('transactions')
            .select('ip_address, user_id, user_email')
            .not('ip_address', 'is', null)
            .not('user_id', 'is', null)
            .not('user_email', 'is', null);

        if (transactionError) throw transactionError;

        // 2. Process the data in code to find shared IPs.
        const ipUserMap = new Map<string, Map<string, { email: string, count: number }>>();

        for (const tx of transactions) {
            if (!tx.ip_address || !tx.user_id || !tx.user_email) continue;

            if (!ipUserMap.has(tx.ip_address)) {
                ipUserMap.set(tx.ip_address, new Map());
            }

            const userMap = ipUserMap.get(tx.ip_address)!;
            
            if (!userMap.has(tx.user_id)) {
                userMap.set(tx.user_id, { email: tx.user_email, count: 0 });
            }

            const userData = userMap.get(tx.user_id);
            if(userData) {
                userData.count++;
            }
        }

        // 3. Filter for IPs with more than one user and format the output.
        for (const [ip, userMap] of ipUserMap.entries()) {
            if (userMap.size > 1) {
                const users = Array.from(userMap.entries()).map(([userId, userData]) => ({
                    user_id: userId,
                    user_email: userData.email,
                    transaction_count: userData.count,
                }));

                results.push({
                    type: 'shared_ip',
                    ip_address: ip,
                    user_count: users.length,
                    users: users.sort((a,b) => b.transaction_count - a.transaction_count),
                });
            }
        }
        
        return NextResponse.json({ suspicious_groups: results });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        console.error("[FRAUD-CHECK API] Error:", errorMessage);
        return NextResponse.json({ error: "Failed to perform fraud check.", details: errorMessage }, { status: 500 });
    }
}
