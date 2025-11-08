
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient } from "@/utils/supabase/admin";

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

// This API route uses the admin client to securely perform fraud checks.
export async function GET(request: NextRequest) {
    const supabase = createSupabaseAdminClient();
    let results: SuspiciousGroup[] = [];

    try {
        // --- CHECK 1: Users sharing the same IP address ---
        // This is a more robust way to handle this check by processing data in code,
        // which avoids complex, potentially slow database queries on large tables.

        // 1. Fetch all transactions that have an IP and user ID.
        const { data: transactions, error: transactionError } = await supabase
            .from('transactions')
            .select('ip_address, user_id')
            .not('ip_address', 'is', null)
            .not('user_id', 'is', null);

        if (transactionError) {
            console.error("Error fetching transactions for fraud check:", transactionError);
            throw new Error(`DB transaction fetch failed: ${transactionError.message}`);
        }

        // 2. Process the data in-memory to group users by IP.
        const ipUserMap = new Map<string, Map<string, { count: number }>>();
        const allUserIds = new Set<string>();

        for (const tx of transactions) {
            if (!tx.ip_address || !tx.user_id) continue;

            if (!ipUserMap.has(tx.ip_address)) {
                ipUserMap.set(tx.ip_address, new Map());
            }
            const userMap = ipUserMap.get(tx.ip_address)!;
            
            if (!userMap.has(tx.user_id)) {
                userMap.set(tx.user_id, { count: 0 });
            }

            const userData = userMap.get(tx.user_id);
            if(userData) {
                userData.count++;
            }
            allUserIds.add(tx.user_id);
        }

        // 3. Fetch emails for all users involved in one go.
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('user_id, email')
            .in('user_id', Array.from(allUserIds));
        
        if (profilesError) {
             console.error("Error fetching profiles for fraud check:", profilesError);
             throw new Error(`DB profiles fetch failed: ${profilesError.message}`);
        }
        
        const emailMap = new Map<string, string>();
        for (const profile of profiles) {
            if (profile.email) {
                emailMap.set(profile.user_id, profile.email);
            }
        }

        // 4. Filter for IPs with more than one distinct user and format the output.
        for (const [ip, userMap] of ipUserMap.entries()) {
            if (userMap.size > 1) { // A suspicious IP has more than 1 user
                const users = Array.from(userMap.entries()).map(([userId, userData]) => ({
                    user_id: userId,
                    user_email: emailMap.get(userId) || 'Email not found',
                    transaction_count: userData.count,
                }));

                results.push({
                    type: 'shared_ip',
                    ip_address: ip,
                    user_count: users.length,
                    users: users.sort((a,b) => b.transaction_count - a.transaction_count), // Show most active users first
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
