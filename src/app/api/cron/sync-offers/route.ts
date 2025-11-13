
// This file is no longer used for cron jobs.
// The logic has been moved to a Supabase Edge Function at `supabase/functions/sync-offers/index.ts`.
// This is to allow for integrated scheduling via the Supabase dashboard.
// You can safely delete this file if you wish.

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "This endpoint is deprecated. Use the Supabase Edge Function 'sync-offers' instead." }, { status: 410 });
}
