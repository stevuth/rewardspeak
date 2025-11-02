
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { List, Users, Shield, Wand2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "Manage users, offers, and site settings.",
};

const adminSections = [
    {
        href: "/admin/users",
        title: "Manage Users",
        description: "View and manage all registered users.",
        icon: Users,
    },
    {
        href: "/admin/offers",
        title: "Manage Offers",
        description: "View and manage all offers in the database.",
        icon: List,
    },
    {
        href: "/admin/seo",
        title: "SEO Optimizer",
        description: "Use AI to optimize meta tags.",
        icon: Wand2,
    }
]

async function getStats() {
    const supabase = createSupabaseServerClient();
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: offerCount } = await supabase.from('all_offers').select('*', { count: 'exact', head: true });
    return { userCount, offerCount };
}

export default async function AdminPortalPage() {
  const { userCount, offerCount } = await getStats();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Portal"
        description="Welcome to the control center. Manage your application here."
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
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => (
            <Link key={section.href} href={section.href} className="block">
                <Card className="hover:bg-muted/50 hover:border-primary/50 transition-all">
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
  );
}
