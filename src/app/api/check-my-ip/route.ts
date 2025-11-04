
import { NextResponse, type NextRequest } from 'next/server';
import { getClientIp } from '@/lib/ip-detection';

export async function GET(request: NextRequest) {
  try {
    const ip = await getClientIp(request);
    return NextResponse.json({ ip });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
