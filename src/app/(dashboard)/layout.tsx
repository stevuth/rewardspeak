
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
  let allTimeEarningsInPoints = 0;

  if (user) {
    // Fetch current points and all-time earnings from profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('points, all_time_earnings')
      .eq('user_id', user.id)
      .single();
    
    if (profileData) {
        profilePoints = profileData.points ?? 0;
        allTimeEarningsInPoints = profileData.all_time_earnings ?? 0;
    }
  }
  
  return <LayoutClient user={user} totalPoints={profilePoints} allTimeEarningsInPoints={allTimeEarningsInPoints}>{children}</LayoutClient>;
}
