
import { NextResponse } from 'next/server';
import { getWannadsOffers } from "@/lib/wannads-api";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { headers } from 'next/headers';

export async function GET() {
    const supabase = createSupabaseServerClient();
    
    try {
        const { data: { user } } = await supabase.auth.getUser();

        let rewardsPeakId = 'guest'; // Default to a guest ID

        if (user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .eq('user_id', user.id)
              .single();
            
            if (profile) {
                rewardsPeakId = profile.id;
            }
        }
        
        // Get user's IP address from headers
        const forwarded = headers().get('x-forwarded-for')
        const userIp = forwarded ? forwarded.split(/, /)[0] : headers().get('x-real-ip') || '127.0.0.1';

        const wannadsOffers = await getWannadsOffers(rewardsPeakId, userIp);
        
        return NextResponse.json({ wannadsOffers });

    } catch (error) {
        console.error("API route /api/wannads-offers error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch Wannads offers.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
