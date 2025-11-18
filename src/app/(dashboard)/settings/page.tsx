
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { SettingsPageClient } from "./settings-page-client";
import type { Metadata } from "next";

export const runtime = 'edge';

export const metadata: Metadata = {
  title: "My Peak Profile",
  description: "Account info, preferences, and personal stats.",
};

export default async function SettingsPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profileData = null;
  let completedOffersCount = 0;

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, points, avatar_url, country_code')
      .eq('user_id', user.id)
      .single();
    profileData = profile;

    const { count, error } = await supabase
        .from('user_offer_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'completed');
    
    if (error) {
        console.error("Error fetching completed offers count:", error);
    } else {
        completedOffersCount = count || 0;
    }
  }
  
  return <SettingsPageClient user={user} profileData={profileData} completedOffersCount={completedOffersCount} />
}
