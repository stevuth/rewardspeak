
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
  Gift,
  Trophy,
  UserPlus,
  LogOut,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/auth/actions";


const primaryAdminNavItems = [
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/offers", label: "Offers", icon: List },
    { href: "/admin/withdrawals", label: "Withdrawals", icon: Gift },
    { href: "/admin/postbacks", label: "Postbacks", icon: ClipboardList },
    { href: "/admin/fraud-detection", label: "Fraud Center", icon: ShieldAlert },
];

const secondaryAdminNavItems = [
    { href: "/admin/featured-content", label: "Featured Content", icon: Star },
    { href: "/admin/leaderboard", label: "Top Earners", icon: Trophy },
    { href: "/admin/top-referrals", label: "Top Referrals", icon: UserPlus },
    { href: "/admin/offer-preview", label: "Offer Preview", icon: Eye },
];

const allAdminNavItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ...primaryAdminNavItems,
    ...secondaryAdminNavItems,
]


function AdminHeader() {
  const pathname = usePathname();
  const getNavLinkClass = (href: string) => {
    // Make matching more specific for admin routes
    const fullHref = href;
    const isActive = (fullHref === "/admin/dashboard" && pathname === fullHref) || (fullHref !== "/admin/dashboard" && pathname.startsWith(fullHref));
    
    const isFraudCenter = href === "/admin/fraud-detection";
    if (isFraudCenter) {
      return cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors border border-transparent",
        isActive
          ? "bg-destructive/10 text-destructive border-destructive/50"
          : "text-destructive/80 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
      );
    }
    
    return cn(
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-muted text-foreground"
        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
    );
  };
  
  const handleLogout = async () => {
    await signOut();
    // After sign-out, the middleware will redirect to the correct login page.
  };

  return (
    <header className="sticky top-0 z-30 flex flex-col items-start gap-4 border-b bg-card px-4 sm:px-6 py-2">
      {/* Mobile Hamburger Menu */}
      <div className="flex items-center justify-between w-full md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
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
                {allAdminNavItems.map(item => (
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
                <form action={handleLogout} className="w-full">
                    <Button variant="destructive" className="w-full">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                    </Button>
                </form>
              </nav>
            </SheetContent>
          </Sheet>
           <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Site
              </Link>
            </Button>
             <form action={handleLogout}>
                <Button variant="destructive" size="icon">
                    <LogOut className="h-4 w-4" />
                </Button>
            </form>
           </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex flex-col w-full gap-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
                  <Image src="/logo.png?v=9" alt="Logo" width={32} height={32} />
                  <span className="text-xl">Admin Portal</span>
              </Link>
              <div className="border-l h-6 border-border/50 ml-2"></div>
               <Link
                    href="/admin/dashboard"
                    className={getNavLinkClass("/admin/dashboard")}
                >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                </Link>
            </div>
            
            <div className="ml-auto flex items-center gap-2">
              <Button asChild variant="outline">
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Site
                </Link>
              </Button>
              <form action={handleLogout}>
                <Button variant="destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                </Button>
              </form>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <nav className="flex flex-row items-center gap-2 text-sm">
                <p className="text-xs font-semibold text-muted-foreground mr-2">Manage:</p>
                {primaryAdminNavItems.map(item => (
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
             <nav className="flex flex-row items-center gap-2 text-sm">
                <p className="text-xs font-semibold text-muted-foreground mr-2">View:</p>
                 {secondaryAdminNavItems.map(item => (
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
      </div>
    </header>
  );
}

export default function AdminDashboardLayout({
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
