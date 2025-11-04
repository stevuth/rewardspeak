
import { createSupabaseApiClient } from '@/utils/supabase/api';
import { NextResponse, type NextRequest } from 'next/server';
import { checkIpWithHub } from '@/lib/ip-detection';

export async function POST(request: NextRequest) {
  const supabase = createSupabaseApiClient(request);
  const formData = await request.json();
  const { email, password, clientIp } = formData;

  try {
    const ipCheck = await checkIpWithHub(clientIp);

    if (ipCheck.block) {
      return NextResponse.json({ error: `Access denied from your location. Reason: ${ipCheck.message}.` }, { status: 403 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const userEmail = data.user?.email || '';
    return NextResponse.json({ success: true, userEmail });

  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
