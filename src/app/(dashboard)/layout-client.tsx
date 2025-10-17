
'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Coins,
  Gift,
  LayoutDashboard,
  Trophy,
  Users,
  CircleHelp,
  Settings,
  Menu,
  Clock,
  Mountain,
  LogOut,
  ArrowLeft,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/utils";
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import type { User } from "@supabase/supabase-js";
import { AnimatedCounter } from "@/components/animated-counter";

const navItems = [
    { href: "/dashboard", label: "Peak Dashboard", icon: LayoutDashboard },
    { href: "/earn", label: "Climb & Earn", icon: Mountain },
    { href: "/leaderboard", label: "Top Climbers", icon: Trophy },
    { href: "/referrals", label: "Invite & Climb", icon: Users },
    { href: "/withdraw", label: "Cash-Out Cabin", icon: Gift },
];

const secondaryNavItems = [
  { href: "/settings", label: "My Peak Profile", icon: Settings },
  { href: "/history", label: "Quest Log", icon: Clock },
  { href: "/support", label: "Help Station", icon: CircleHelp },
];

const mobileNavItems = [
    { href: "/earn", label: "Climb & Earn", icon: Mountain },
    { href: "/withdraw", label: "Cash-Out", icon: Gift },
    { href: "/leaderboard", label: "Top Climbers", icon: Trophy },
    { href: "/settings", label: "My Profile", icon: Settings },
]

const recentEarnings: any[] = [];

function SidebarNavs() {
  const pathname = usePathname();

  const getNavLinkClass = (href: string) => {
    const isActive = pathname.startsWith(href) && (href !== '/dashboard' || pathname === href);
    return cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm",
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-muted"
    );
  };

  return (
    <>
      <nav className="flex-1 space-y-1 p-4">
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

      <div className="mt-auto p-4 space-y-1 border-t">
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
         <Link
            href="/?logout=true"
            className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm text-muted-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Link>
      </div>
    </>
  );
}

function SidebarContent({ user, totalPoints, totalAmountEarned, children }: { user: User | null, totalPoints: number, totalAmountEarned: number, children?: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-lg font-headline"
        >
          <Image src="/logo.png?v=2" alt="Rewards Peak Logo" width={28} height={28} />
          <span className="text-xl font-bold">Rewards Peak</span>
        </Link>
        {children}
      </div>

      <div className="p-4 flex items-center gap-4 bg-muted/50 border-b">
        <div className="relative h-12 w-12 shrink-0">
          <Image
            src={"https://picsum.photos/seed/avatar1/40/40"}
            alt="user avatar"
            width={48}
            height={48}
            className="rounded-full border-2 border-primary/50"
            data-ai-hint={"person portrait"}
          />
        </div>
        <div className="flex-1">
          <p className="font-semibold">{user?.email}</p>
          <div className="flex items-center gap-4">
            <div className="text-xs">
              <p className="text-muted-foreground">Balance</p>
              <p className="font-bold text-primary"><AnimatedCounter value={totalPoints} /> Pts</p>
            </div>
            <div className="text-xs">
              <p className="text-muted-foreground">Earned</p>
              <p className="font-bold">$<AnimatedCounter value={totalAmountEarned} /></p>
            </div>
          </div>
        </div>
      </div>
      <SidebarNavs />
    </div>
  );
}


function MobileSidebar({ user }: { user: User | null }) {
    const pathname = usePathname();
    const getNavLinkClass = (href: string) => {
        const isActive = pathname.startsWith(href) && (href !== '/dashboard' || pathname === href);
        return cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted"
        );
    };

    const mobileNavLinks = [...navItems, ...secondaryNavItems].filter(
        (item) => !mobileNavItems.some((mobileItem) => mobileItem.href === item.href)
    );

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="top" className="w-full bg-card p-0">
                 <div className="w-full">
                    <div className="p-4 border-b flex items-center justify-between">
                        <Link
                        href="/dashboard"
                        className="flex items-center gap-2 font-semibold text-lg font-headline"
                        >
                          <Image src="/logo.png?v=2" alt="Rewards Peak Logo" width={28} height={28} />
                          <span className="text-xl font-bold">Rewards Peak</span>
                        </Link>
                        <SheetClose asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <X className="h-5 w-5" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </SheetClose>
                    </div>
                     <div className="grid grid-cols-2 gap-4 p-4">
                        <nav className="flex-1 space-y-1">
                        {mobileNavLinks.map((item) => (
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
                        <div className="space-y-4">
                        <div className="p-4 flex items-center gap-4 bg-muted/50 rounded-lg">
                            <UserNav user={user} />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{user?.email}</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>
                        </div>
                        <Button variant="ghost" asChild className="w-full justify-start">
                            <Link href="/?logout=true">
                                <LogOut className="mr-2 h-4 w-4" />
                                Log Out
                            </Link>
                        </Button>
                        </div>
                    </div>
                 </div>
            </SheetContent>
        </Sheet>
    );
}

function Header({ user, totalPoints, totalAmountEarned }: { user: User | null, totalPoints: number, totalAmountEarned: number }) {
    const router = useRouter();
    const userBalanceInCash = totalPoints / 100;

    return (
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
            <div className="hidden md:flex">
                <SidebarTrigger />
            </div>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Go back</span>
            </Button>
            <div className="flex-1 overflow-x-auto whitespace-nowrap">
                <div className="flex gap-2 items-center">
                {recentEarnings.map((earning, i) => (
                    <div key={i} className="hidden md:flex items-center gap-2 p-2 rounded-md bg-muted/50 text-xs">
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
                <div className="hidden sm:flex items-center gap-4">
                    <div className="text-xs text-right">
                        <p className="text-muted-foreground">Balance</p>
                        <p className="font-bold text-primary"><AnimatedCounter value={totalPoints} /> Pts</p>
                    </div>
                    <div className="text-xs text-right">
                        <p className="text-muted-foreground">Earned</p>
                        <p className="font-bold">$<AnimatedCounter value={totalAmountEarned} /></p>
                    </div>
                </div>
                <div className="flex sm:hidden items-center gap-2 text-xs">
                <span className="font-bold text-primary"><AnimatedCounter value={totalPoints} /> Pts</span>
                <span className="font-bold text-muted-foreground">/</span>
                <span className="font-bold">$<AnimatedCounter value={userBalanceInCash} /></span>
                </div>
                <UserNav user={user} />
                <MobileSidebar user={user} />
            </div>
        </header>
    )
}

function MobileBottomNav() {
    const pathname = usePathname();
    return (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-card p-2 md:hidden z-50">
            <div className="grid grid-cols-4 gap-2">
                {mobileNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 rounded-md p-2 text-xs font-medium",
                                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="truncate">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export function LayoutClient({ user, children, totalPoints, totalAmountEarned }: { user: User | null, children: React.ReactNode, totalPoints: number, totalAmountEarned: number }) {
    return (
        <SidebarProvider>
          <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
            <Sidebar collapsible="icon" className="bg-card border-r">
              <SidebarContent user={user} totalPoints={totalPoints} totalAmountEarned={totalAmountEarned} />
            </Sidebar>
            <div className="flex flex-col overflow-hidden">
              <Header user={user} totalPoints={totalPoints} totalAmountEarned={totalAmountEarned} />
              <SidebarInset>
                <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background overflow-y-auto pb-20 md:pb-8">{children}</main>
              </SidebarInset>
              <MobileBottomNav />
            </div>
          </div>
        </SidebarProvider>
    )
}
