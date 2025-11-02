
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { List, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

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
    }
]

export default function AdminPortalPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Portal"
        description="Welcome to the control center. Manage your application here."
      />
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
