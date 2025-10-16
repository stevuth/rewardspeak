
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

  let profileData = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('points')
      .eq('user_id', user.id)
      .single();
    profileData = data;
  }
  
  const totalPoints = profileData?.points ?? 0;
  const totalAmountEarned = totalPoints / 100;

  return <LayoutClient user={user} totalPoints={totalPoints} totalAmountEarned={totalAmountEarned}>{children}</LayoutClient>;
}
