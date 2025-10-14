"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Coins,
  Gift,
  LayoutDashboard,
  Trophy,
  Users,
  Ticket,
  CircleHelp,
  Settings,
  Menu,
  Clock,
  DollarSign,
  Swords,
  Mountain,
  Zap,
  TrendingUp,
  Rocket,
  PlusCircle,
  FileText,
  Shield,
  BookUser,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { user } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { UserNav } from "@/components/user-nav";

const navItems = [
    { href: "/dashboard", label: "Peak Dashboard", icon: LayoutDashboard },
    { href: "/climb-and-earn", label: "Climb & Earn", icon: Mountain },
    { href: "/cash-out-cabin", label: "Cash-Out Cabin", icon: Gift },
    { href: "/invite-and-climb", label: "Invite & Climb", icon: Users },
    { href: "/top-climbers", label: "Top Climbers", icon: Trophy },
];

const secondaryNavItems = [
  { href: "/my-peak-profile", label: "My Peak Profile", icon: Settings },
  { href: "/help-station", label: "Help Station", icon: CircleHelp },
];

const recentEarnings: any[] = [
];

function SidebarContent() {
  const pathname = usePathname();
  const getNavLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm ${
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-muted"
    }`;
  };

  return (
    <>
      <div className="p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-lg font-headline"
        >
          <Coins className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Rewards Peak</span>
        </Link>
      </div>

      <div className="p-4 flex flex-col items-center text-center">
        <div className="relative h-20 w-20">
            <Image 
                src={user.avatarUrl} 
                alt="user avatar" 
                width={80} 
                height={80} 
                className="rounded-full border-4 border-primary/50"
                data-ai-hint={user.avatarHint}
            />
        </div>
        <p className="font-semibold mt-2">{user.name}</p>
        <p className="text-sm text-muted-foreground">Level 0</p>
        <div className="mt-2 flex items-center gap-2 rounded-md bg-muted p-2 text-sm font-semibold">
          <Coins className="h-4 w-4 text-yellow-400" />
          <span>{user.totalPoints.toLocaleString()} (${(user.totalPoints / 1000).toFixed(2)})</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => (
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

       <div className="mt-auto p-4 space-y-1">
        {secondaryNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm ${
              pathname.startsWith(item.href)
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[260px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col">
          <SidebarContent />
        </div>
      </div>
      <div className="flex flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 bg-card">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="hidden md:flex flex-1 overflow-x-auto whitespace-nowrap">
             <div className="flex gap-2 items-center">
                 {recentEarnings.map((earning, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-xs">
                        <div className="flex flex-col">
                            <span className="font-bold text-primary">{earning.name}</span>
                            <span className="text-muted-foreground">{earning.user}</span>
                        </div>
                        <Badge variant="secondary">{earning.amount}</Badge>
                    </div>
                 ))}
             </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="hidden sm:flex items-center gap-1 text-sm font-semibold">
                <Clock className="h-4 w-4" />
                <span>05:11:41</span>
            </div>
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
