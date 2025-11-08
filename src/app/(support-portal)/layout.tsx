
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export default async function SupportPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // For now, we use the same logic as the admin portal.
  // This could be changed to check for a "support" role in the future.
  const isSupportUser = user?.email?.endsWith("@rewardspeak.com");

  if (!isSupportUser) {
    redirect("/support/login");
  }

  return <>{children}</>;
}
