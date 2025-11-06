
'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  List,
  ArrowLeft,
  Menu,
  Eye,
  Star,
  ClipboardList,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const adminNavItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/offers", label: "Offers", icon: List },
    { href: "/admin/offer-preview", label: "Offer Preview", icon: Eye },
    { href: "/admin/featured-content", label: "Featured Content", icon: Star },
    { href: "/admin/postbacks", label: "Postbacks", icon: ClipboardList },
    { href: "/admin/withdrawals", label: "Withdrawals", icon: Gift },
];

function AdminHeader() {
  const pathname = usePathname();
  const getNavLinkClass = (href: string) => {
    const isActive = (href === "/admin" && pathname === href) || (href !== "/admin" && pathname.startsWith(href));
    return cn(
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-muted text-foreground"
        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
    );
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs bg-card">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/admin"
              className="group flex h-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Image src="/logo.png?v=9" alt="Logo" width={32} height={32} className="transition-all group-hover:scale-110" />
              <span className="text-xl font-bold text-foreground">Admin Portal</span>
            </Link>
            {adminNavItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={getNavLinkClass(item.href)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
             <Button asChild variant="outline" className="w-full mt-auto">
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Site
                </Link>
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
      
      <div className="flex items-center gap-4">
        <Link href="/admin" className="hidden sm:flex items-center gap-2 font-semibold">
            <Image src="/logo.png?v=9" alt="Logo" width={32} height={32} />
            <span className="text-xl">Admin Portal</span>
        </Link>
        <nav className="hidden md:flex md:flex-row md:items-center md:gap-2 md:text-sm lg:gap-4 ml-6">
            {adminNavItems.map(item => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={getNavLinkClass(item.href)}
                >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                </Link>
            ))}
        </nav>
      </div>
      
      <div className="ml-auto">
        <Button asChild variant="outline" className="hidden sm:flex">
          <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Site
          </Link>
        </Button>
      </div>
    </header>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <AdminHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
