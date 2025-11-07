
// This is the main Server Component
// It fetches data and passes it to the Client Component
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { LayoutClient } from "./layout-client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profilePoints = 0;
  let withdrawnPoints = 0;

  if (user) {
    // Fetch current points and withdrawn amount from profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('points, withdrawn')
      .eq('user_id', user.id)
      .single();
    
    if (profileData) {
        profilePoints = profileData.points ?? 0;
        withdrawnPoints = profileData.withdrawn ?? 0; // Ensure withdrawnPoints is always a number
    }
  }
  
  return <LayoutClient user={user} totalPoints={profilePoints} withdrawnPoints={withdrawnPoints}>{children}</LayoutClient>;
}
