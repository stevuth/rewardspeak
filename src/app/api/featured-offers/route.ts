
// This file is no longer used for fetching featured offers.
// The logic has been moved to src/app/home-page-content.tsx to be handled client-side.
// This is to prevent server-side rendering issues with environment variables.
// You can safely delete this file if you wish.

import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({ featuredOffers: [] });
}
