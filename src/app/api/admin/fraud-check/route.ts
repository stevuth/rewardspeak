
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
        // This is the part that might be slow. We'll be robust.
        const { data: transactions, error: transactionError } = await supabase
            .from('transactions')
            .select('ip_address, user_id, user_email')
            .not('ip_address', 'is', null)
            .not('user_id', 'is', null)
            .not('user_email', 'is', null);

        if (transactionError) {
            console.error("Error fetching transactions for fraud check:", transactionError);
            throw new Error(`DB transaction fetch failed: ${transactionError.message}`);
        }

        // 2. Process the data in-memory to group users by IP.
        const ipUserMap = new Map<string, Map<string, { email: string, count: number }>>();

        for (const tx of transactions) {
            // Skip any records with missing essential data
            if (!tx.ip_address || !tx.user_id || !tx.user_email) continue;

            // Get or create the map for this IP
            if (!ipUserMap.has(tx.ip_address)) {
                ipUserMap.set(tx.ip_address, new Map());
            }
            const userMap = ipUserMap.get(tx.ip_address)!;
            
            // Get or create the data for this user
            if (!userMap.has(tx.user_id)) {
                userMap.set(tx.user_id, { email: tx.user_email, count: 0 });
            }

            // Increment the transaction count for this user on this IP
            const userData = userMap.get(tx.user_id);
            if(userData) {
                userData.count++;
            }
        }

        // 3. Filter for IPs with more than one distinct user and format the output.
        for (const [ip, userMap] of ipUserMap.entries()) {
            if (userMap.size > 1) { // A suspicious IP has more than 1 user
                const users = Array.from(userMap.entries()).map(([userId, userData]) => ({
                    user_id: userId,
                    user_email: userData.email,
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
