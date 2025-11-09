import { redirect } from 'next/navigation';

// This page now permanently redirects to the homepage with a referral query parameter.
// This simplifies the app structure and resolves a module resolution error in Next.js.
// The primary purpose of the /join URL is to be a shareable link for referrals.
export default function JoinPage() {
  redirect('/?ref=join');
}
