
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
  let referralEarnings = 0;

  if (user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('points')
      .eq('user_id', user.id)
      .single();
    
    if (profileData) {
        profilePoints = profileData.points ?? 0;
    }

    // Fetch referral earnings
    const { data: earnings, error: earningsError } = await supabase.rpc('get_referral_earnings');
    if (earningsError) {
        console.error("Error fetching referral earnings: ", earningsError);
    } else {
        referralEarnings = earnings ?? 0;
    }
  }

  return <LayoutClient user={user} profilePoints={profilePoints} referralEarnings={referralEarnings}>{children}</LayoutClient>;
}
