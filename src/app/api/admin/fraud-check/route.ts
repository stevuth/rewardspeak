
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
        const { data: ipData, error: ipError } = await supabase
            .from('transactions')
            .select('ip_address, user_id, user_email')
            .not('ip_address', 'is', null)
            .not('user_id', 'is', null);

        if (ipError) throw ipError;

        const ipUserMap = new Map<string, Map<string, { email: string, count: number }>>();
        for (const { ip_address, user_id, user_email } of ipData) {
            if (!ipUserMap.has(ip_address)) {
                ipUserMap.set(ip_address, new Map());
            }
            const userMap = ipUserMap.get(ip_address)!;
            if (!userMap.has(user_id)) {
                userMap.set(user_id, { email: user_email || 'N/A', count: 0 });
            }
            userMap.get(user_id)!.count++;
        }

        for (const [ip, users] of ipUserMap.entries()) {
            if (users.size > 1) {
                results.push({
                    type: 'shared_ip',
                    ip_address: ip,
                    user_count: users.size,
                    users: Array.from(users.entries()).map(([userId, userData]) => ({
                        user_id: userId,
                        user_email: userData.email,
                        transaction_count: userData.count,
                    })).sort((a, b) => b.transaction_count - a.transaction_count),
                });
            }
        }

        // --- CHECK 2: Suspicious Referral Chains (same IP) ---
        // 1. Get all profiles with a referrer
        const { data: referredProfiles, error: referredError } = await supabase
            .from('profiles')
            .select('user_id, referred_by')
            .not('referred_by', 'is', null);
        
        if (referredError) throw referredError;

        if (referredProfiles.length > 0) {
            const allUserIds = new Set<string>();
            const referredMap = new Map<string, string>(); // referred_user_id -> referrer_profile_id
            
            referredProfiles.forEach(p => {
                allUserIds.add(p.user_id);
                referredMap.set(p.user_id, p.referred_by);
            });

            // 2. Get referrer user_ids
            const { data: referrerProfiles, error: referrerError } = await supabase
                .from('profiles')
                .select('user_id, id')
                .in('id', Array.from(new Set(referredProfiles.map(p => p.referred_by))));

            if (referrerError) throw referrerError;
            
            const referrerIdMap = new Map<string, string>(); // profile_id -> user_id
            referrerProfiles.forEach(p => {
                allUserIds.add(p.user_id);
                referrerIdMap.set(p.id, p.user_id);
            });

            // 3. Get last known IPs for all involved users
            const { data: userIps, error: userIpsError } = await supabase
                .from('transactions')
                .select('user_id, ip_address, created_at')
                .in('user_id', Array.from(allUserIds))
                .order('created_at', { ascending: false });

            if (userIpsError) throw userIpsError;

            const lastIpMap = new Map<string, string>(); // user_id -> ip_address
            userIps.forEach(tx => {
                if (!lastIpMap.has(tx.user_id)) {
                    lastIpMap.set(tx.user_id, tx.ip_address);
                }
            });

            // 4. Get emails for all users
            const { data: authUsers, error: authUsersError } = await supabase.auth.admin.listUsers({
                page: 1,
                perPage: 1000, // Adjust as needed
            });
            if (authUsersError) throw authUsersError;
            const emailMap = new Map(authUsers.users.map(u => [u.id, u.email]));

            // 5. Compare IPs
            for (const [referredUserId, referrerProfileId] of referredMap.entries()) {
                const referrerUserId = referrerIdMap.get(referrerProfileId);
                if (!referrerUserId) continue;

                const referredIp = lastIpMap.get(referredUserId);
                const referrerIp = lastIpMap.get(referrerUserId);

                if (referredIp && referrerIp && referredIp === referrerIp) {
                    results.push({
                        type: 'suspicious_referral',
                        ip_address: referredIp,
                        referrer: {
                            user_id: referrerUserId,
                            email: emailMap.get(referrerUserId) || 'N/A'
                        },
                        referred: {
                            user_id: referredUserId,
                            email: emailMap.get(referredUserId) || 'N/A'
                        },
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
