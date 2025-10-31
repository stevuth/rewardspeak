import { NextResponse } from 'next/server';
import { getWannadsOffers } from "@/lib/wannads-api";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { headers } from 'next/headers';

export async function GET() {
    const supabase = createSupabaseServerClient();
    
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (!profile) {
            return NextResponse.json({ error: "User profile not found" }, { status: 404 });
        }
        
        const rewardsPeakId = profile.id;
        
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
