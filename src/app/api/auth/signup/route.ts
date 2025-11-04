
import { createSupabaseApiClient } from '@/utils/supabase/api';
import { NextResponse, type NextRequest } from 'next/server';
import { checkIpWithHub } from '@/lib/ip-detection';

export async function POST(request: NextRequest) {
  const supabase = createSupabaseApiClient(request);
  const formData = await request.json();
  const { email, password, referral_code, clientIp } = formData;
  
  try {
    const ipCheck = await checkIpWithHub(clientIp);

    if (ipCheck.block) {
      return NextResponse.json({ error: `Access denied from your location. Reason: ${ipCheck.message}.` }, { status: 403 });
    }
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
    const emailRedirectTo = new URL('/auth/callback', siteUrl);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: emailRedirectTo.toString(),
        data: {
          referral_code: referral_code || null,
        }
      },
    });

    if (error) {
      console.error("Supabase sign up error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Signup API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
