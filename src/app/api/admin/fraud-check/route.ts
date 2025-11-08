
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient } from "@/utils/supabase/admin";

export async function GET(request: NextRequest) {
    const supabase = createSupabaseAdminClient();

    try {
        // Step 1: Find IP addresses used by more than one distinct user_id
        const { data: ipData, error: ipError } = await supabase.rpc('get_ips_with_multiple_users');
        
        if (ipError) {
            console.error("Error fetching suspicious IPs:", ipError);
            throw ipError;
        }

        if (!ipData || ipData.length === 0) {
            return NextResponse.json({ suspicious_groups: [] });
        }
        
        const suspiciousIPs = ipData.map((row: any) => row.ip_address);

        // Step 2: Fetch all transactions for these suspicious IPs
        const { data: transactions, error: txError } = await supabase
            .from('transactions')
            .select('ip_address, user_id, user_email')
            .in('ip_address', suspiciousIPs);

        if (txError) {
            console.error("Error fetching transactions for suspicious IPs:", txError);
            throw txError;
        }

        // Step 3: Group users by IP address and count their transactions
        const ipGroups = transactions.reduce((acc, tx) => {
            const { ip_address, user_id, user_email } = tx;
            if (!ip_address || !user_id) return acc;

            // Initialize the group for the IP if it doesn't exist
            if (!acc[ip_address]) {
                acc[ip_address] = {
                    ip_address,
                    users: new Map()
                };
            }
            
            const group = acc[ip_address];
            
            // Get or create the user within the IP group
            let user = group.users.get(user_id);
            if (!user) {
                user = {
                    user_id,
                    user_email: user_email || 'N/A',
                    transaction_count: 0
                };
                group.users.set(user_id, user);
            }
            
            // Increment the transaction count for that user
            user.transaction_count++;
            
            return acc;
        }, {} as Record<string, { ip_address: string; users: Map<string, any> }>);

        // Step 4: Format the output
        const result = Object.values(ipGroups).map(group => {
            const usersArray = Array.from(group.users.values());
            return {
                ip_address: group.ip_address,
                user_count: usersArray.length,
                users: usersArray.sort((a, b) => b.transaction_count - a.transaction_count), // Sort users by transaction count
            };
        }).sort((a, b) => b.user_count - a.user_count); // Sort groups by number of users

        return NextResponse.json({ suspicious_groups: result });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        console.error("[FRAUD-CHECK API] Error:", errorMessage);
        return NextResponse.json({ error: "Failed to perform fraud check.", details: errorMessage }, { status: 500 });
    }
}
