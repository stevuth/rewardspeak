
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
  X,
  ClipboardList,
  LayoutGrid,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/utils";
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import type { User } from "@supabase/supabase-js";
import { AnimatedCounter } from "@/components/animated-counter";
import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { SafeImage } from "@/components/safe-image";


const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/earn", label: "Earn", icon: Mountain },
    { href: "/referrals", label: "Invite & Earn", icon: Users },
    { href: "/leaderboard", label: "Top Earners", icon: Trophy },
    { href: "/withdraw", label: "Cash-Out Cabin", icon: Gift },
];

const secondaryNavItems = [
  { href: "/history", label: "Offers Log", icon: Clock },
  { href: "/settings", label: "My Peak Profile", icon: Settings },
  { href: "/support", label: "Help Station", icon: CircleHelp },
];

const mobileNavItems = [
    { href: "/withdraw", label: "Cash-Out", icon: Gift },
    { href: "/earn", label: "Earn", icon: Mountain },
    { href: "/history", label: "Offers Log", icon: Clock },
    { href: "/leaderboard", label: "Top Earners", icon: Trophy },
]

const recentEarnings: any[] = [];

function SidebarNavs({ user }: { user: User | null }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);


  const getNavLinkClass = (href: string) => {
    const isActive = isClient && pathname.startsWith(href) && (href !== '/dashboard' || pathname === href);
    return cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm font-bold",
      isActive
        ? "bg-secondary text-secondary-foreground"
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
        {user && user.email?.endsWith('@rewardspeak.com') && (
            <Link href="/admin" className={getNavLinkClass('/admin')}>
                <Shield className="h-4 w-4" />
                Admin Portal
            </Link>
        )}
      </nav>

      <div className="mt-auto p-4 space-y-1 border-t">
        {secondaryNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm font-bold",
              isClient && pathname.startsWith(item.href)
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
         <Link
            href={`/?event=logout&user_email=${user?.email || ''}`}
            className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm text-muted-foreground hover:bg-primary hover:text-primary-foreground font-bold"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Link>
      </div>
    </>
  );
}

function SidebarContent({ user, children }: { user: User | null, children?: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-lg font-headline"
        >
          <Image src="/logo.png?v=7" alt="Rewards Peak Logo" width={40} height={40} />
          <span className="text-xl font-bold">Rewards Peak</span>
        </Link>
        {children}
      </div>
      <SidebarNavs user={user} />
    </div>
  );
}


function MobileSidebar({ user, avatarUrl }: { user: User | null; avatarUrl: string | null }) {
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const getNavLinkClass = (href: string) => {
        const isActive = isClient && pathname.startsWith(href) && (href !== '/dashboard' || pathname === href);
        return cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        );
    };

    const mobileNavLinks = [...navItems, ...secondaryNavItems].filter(
        (item) => !mobileNavItems.some((mobileItem) => mobileItem.href === item.href)
    );

     if (user && user.email?.endsWith('@rewardspeak.com')) {
        mobileNavLinks.push({ href: "/admin", label: "Admin Portal", icon: Shield });
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="top" className="w-full bg-card p-0 rounded-b-2xl">
                 <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                 <div className="w-full">
                    <div className="p-4 border-b flex items-center justify-between">
                        <Link
                        href="/dashboard"
                        className="flex items-center gap-2 font-semibold text-lg font-headline"
                        >
                          <Image src="/logo.png?v=7" alt="Rewards Peak Logo" width={32} height={32} />
                          <span className="text-lg font-bold">Rewards Peak</span>
                        </Link>
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
                            <UserNav user={user} avatarUrl={avatarUrl} />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{user?.email}</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>
                        </div>
                        <Button variant="ghost" asChild className="w-full justify-start hover:bg-accent hover:text-accent-foreground">
                            <Link href={`/?event=logout&user_email=${user?.email || ''}`}>
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

function Header({ user, totalPoints, withdrawnPoints, avatarUrl }: { user: User | null, totalPoints: number, withdrawnPoints: number, avatarUrl: string | null }) {
    const router = useRouter();

    return (
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
            <Button variant="outline" size="icon" className="shrink-0 md:hidden" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Go back</span>
            </Button>
            <div className="flex-1 overflow-x-auto whitespace-nowrap">
                <div className="flex gap-2 items-center">
                {recentEarnings.map((earning, i) => (
                    <div key={i} className="hidden md:flex items-center gap-2 p-2 rounded-md bg-muted/50 text-xs">
                    <div className="flex flex-col">
                        <span className="font-bold text-secondary">{earning.name}</span>
                        <span className="text-muted-foreground">{earning.user}</span>
                    </div>
                    {/* <Badge variant="secondary">{earning.amount}</Badge> */}
                    </div>
                ))}
                </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
                <div className="hidden sm:flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Balance</p>
                        <p className="font-bold text-secondary"><AnimatedCounter value={totalPoints} /> Pts</p>
                    </div>
                    <Separator orientation="vertical" className="h-6" />
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Withdrawn</p>
                        <p className="font-bold"><AnimatedCounter value={withdrawnPoints} /> Pts</p>
                    </div>
                </div>
                 <div className="flex sm:hidden items-center gap-2 text-xs">
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Balance</p>
                        <p className="font-bold text-secondary"><AnimatedCounter value={totalPoints} /> Pts</p>
                    </div>
                     <Separator orientation="vertical" className="h-6" />
                     <div className="text-right">
                        <p className="text-xs text-muted-foreground">W/drawn</p>
                        <p className="font-bold"><AnimatedCounter value={withdrawnPoints} /> Pts</p>
                    </div>
                </div>
                <UserNav user={user} avatarUrl={avatarUrl} />
                <MobileSidebar user={user} avatarUrl={avatarUrl} />
            </div>
        </header>
    )
}

function MobileBottomNav() {
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-card p-1 md:hidden z-50">
            <div className="grid grid-cols-4 gap-1">
                {mobileNavItems.map((item) => {
                    const isActive = isClient && pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex flex-col items-center gap-1 p-2 text-xs font-bold text-muted-foreground",
                                isActive ? "text-accent border-b-2 border-accent" : "hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5 transition-colors duration-200", isActive ? "text-accent" : "group-hover:text-accent")} />
                            <span className="truncate">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export function LayoutClient({ user, children, totalPoints, withdrawnPoints, avatarUrl }: { user: User | null, children: React.ReactNode, totalPoints: number, withdrawnPoints: number, avatarUrl: string | null }) {
    return (
        <SidebarProvider>
          <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
            <Sidebar collapsible="icon" className="bg-card border-r">
              <SidebarContent user={user} />
            </Sidebar>
            <div className="flex flex-col overflow-hidden">
              <Header user={user} totalPoints={totalPoints} withdrawnPoints={withdrawnPoints} avatarUrl={avatarUrl} />
              <SidebarInset>
                <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background overflow-y-auto pb-20 md:pb-8">{children}</main>
              </SidebarInset>
              <MobileBottomNav />
            </div>
          </div>
        </SidebarProvider>
    )
}
