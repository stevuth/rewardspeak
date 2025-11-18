
import { redirect } from 'next/navigation';

export const runtime = 'edge';

export default function AdminRootPage() {
  // This page is just a redirect to the actual admin dashboard.
  // The layout will handle the auth check.
  redirect('/admin/dashboard');
}
