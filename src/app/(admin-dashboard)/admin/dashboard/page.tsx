
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { List, Users, Star, Gift, Trophy, UserPlus, Eye, ClipboardList, LayoutDashboard } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "Manage users, offers, and site settings.",
};

const managementSections = [
    {
        href: "/admin/users",
        title: "Manage Users",
        description: "View and manage all registered users.",
        icon: Users,
    },
    {
        href: "/admin/offers",
        title: "Manage Offers",
        description: "Sync, filter, and enable/disable offers.",
        icon: List,
    },
    {
        href: "/admin/withdrawals",
        title: "Withdrawal Requests",
        description: "Approve or reject user withdrawal requests.",
        icon: Gift,
    },
    {
        href: "/admin/postbacks",
        title: "Postback History",
        description: "View a log of all offer completions.",
        icon: ClipboardList,
    }
]

const contentViewSections = [
     {
        href: "/admin/featured-content",
        title: "Featured Content",
        description: "Set featured and top converting offers.",
        icon: Star,
    },
    {
        href: "/admin/leaderboard",
        title: "Top Earners",
        description: "View the site's leaderboard.",
        icon: Trophy,
    },
    {
        href: "/admin/top-referrals",
        title: "Top Referrals",
        description: "View the top referrers by earnings.",
        icon: UserPlus,
    },
    {
        href: "/admin/offer-preview",
        title: "Offer Preview",
        description: "See how offers are displayed to users.",
        icon: Eye,
    }
]

async function getStats() {
    const supabase = createSupabaseServerClient();
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: offerCount } = await supabase.from('all_offers').select('*', { count: 'exact', head: true });
    const { count: pendingWithdrawals } = await supabase.from('withdrawal_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    return { userCount, offerCount, pendingWithdrawals };
}

export default async function AdminPortalPage() {
  const { userCount, offerCount, pendingWithdrawals } = await getStats();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Portal"
        description="Welcome to the control center. Manage your application here."
        icon={LayoutDashboard}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
              <List className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{offerCount}</div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingWithdrawals}</div>
               <p className="text-xs text-muted-foreground">requests need review</p>
            </CardContent>
          </Card>
      </div>
      
      <div className="space-y-8">
        <div>
            <h2 className="text-xl font-semibold tracking-tight mb-4">Management</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {managementSections.map((section) => (
                <Link key={section.href} href={section.href} className="block">
                    <Card className="hover:bg-muted/50 hover:border-primary/50 transition-all h-full">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                            <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                <section.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle>{section.title}</CardTitle>
                                <CardDescription>{section.description}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </Link>
            ))}
            </div>
        </div>
        <div>
            <h2 className="text-xl font-semibold tracking-tight mb-4">Content & Views</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contentViewSections.map((section) => (
                <Link key={section.href} href={section.href} className="block">
                    <Card className="hover:bg-muted/50 hover:border-primary/50 transition-all h-full">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                            <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                <section.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle>{section.title}</CardTitle>
                                <CardDescription>{section.description}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </Link>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
}
