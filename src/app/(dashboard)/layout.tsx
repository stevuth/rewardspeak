
// This is the main Server Component
// It fetches data and passes it to the Client Component
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { LayoutClient } from "./layout-client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profilePoints = 0;
  let withdrawnPoints = 0;
  let avatarUrl = null;

  if (user) {
    // Fetch current points, withdrawn amount, and avatar from profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('points, withdrawn, avatar_url')
      .eq('user_id', user.id)
      .single();

    if (profileData) {
      profilePoints = profileData.points ?? 0;
      withdrawnPoints = profileData.withdrawn ?? 0;
      avatarUrl = profileData.avatar_url;
    }
  }

  return <LayoutClient user={user} totalPoints={profilePoints} withdrawnPoints={withdrawnPoints} avatarUrl={avatarUrl}>{children}</LayoutClient>;
}
