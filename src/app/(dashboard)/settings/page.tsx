
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { SettingsPageClient } from "./settings-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Peak Profile",
  description: "Account info, preferences, and personal stats.",
};

export default async function SettingsPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profileData = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('id, points, avatar_url, country_code')
      .eq('user_id', user.id)
      .single();
    profileData = data;
  }
  
  return <SettingsPageClient user={user} profileData={profileData} />
}
