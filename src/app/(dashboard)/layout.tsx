
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
  let totalWithdrawnUsd = 0;

  if (user) {
    // Fetch current points balance from profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('points')
      .eq('user_id', user.id)
      .single();
    
    if (profileData) {
        profilePoints = profileData.points ?? 0;
    }

    // Fetch sum of all completed withdrawals
    const { data: withdrawalData, error: withdrawalError } = await supabase
      .from('withdrawal_requests')
      .select('amount_usd')
      .eq('user_id', user.id)
      .eq('status', 'completed');
    
    if (withdrawalError) {
      console.error("Error fetching withdrawal history:", withdrawalError);
    } else if (withdrawalData) {
      totalWithdrawnUsd = withdrawalData.reduce((sum, req) => sum + (req.amount_usd || 0), 0);
    }
  }
  
  const allTimeEarningsInPoints = profilePoints + (totalWithdrawnUsd * 1000);

  return <LayoutClient user={user} totalPoints={profilePoints} allTimeEarningsInPoints={allTimeEarningsInPoints}>{children}</LayoutClient>;
}
