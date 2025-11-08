
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminUser = user?.email?.endsWith("@rewardspeak.com");

  if (!isAdminUser) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
