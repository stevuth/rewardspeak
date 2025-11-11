
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
  DollarSign,
  LogOut,
  ArrowLeft,
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
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import type { User } from "@supabase/supabase-js";
import { AnimatedCounter } from "@/components/animated-counter";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/app/auth/actions";
import { motion } from 'framer-motion';


const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/earn", label: "Earn", icon: DollarSign },
    { href: "/referrals", label: "Invite & Earn", icon: Users },
    { href: "/leaderboard", label: "Top Earners", icon: Trophy },
    { href: "/withdraw", label: "Cash-Out Cabin", icon: Gift },
];

const secondaryNavItems = [
  { href: "/history", label: "Offers Log", icon: Clock },
  { href: "/settings", label: "My Peak Profile", icon: Settings },
  { href: "/help", label: "Help Center", icon: CircleHelp },
];

const SvgNavButton = ({ href, icon: Icon, label, isActive, onClick }: { href: string; icon: React.ElementType; label: string; isActive: boolean, onClick: () => void }) => {
  return (
    <Link href={href} className="relative block w-full group" onClick={onClick}>
      <svg
        viewBox="0 0 200 50"
        preserveAspectRatio="none"
        className="w-full h-auto"
      >
        <path
          d="M 5 5 C 10 0, 190 0, 195 5 L 195 45 C 190 50, 10 50, 5 45 Z"
          fill={isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted)/0.5)'}
          stroke={isActive ? 'hsl(var(--primary)/0.5)' : 'hsl(var(--border))'}
          strokeWidth="1"
          className="transition-all duration-300 group-hover:fill-[hsl(var(--muted))] "
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-start px-4 gap-3 pointer-events-none">
        <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
        <span className={cn("font-semibold transition-colors", isActive ? "text-primary-foreground" : "text-foreground")}>{label}</span>
      </div>
    </Link>
  );
};


const recentEarnings: any[] = [];

function SidebarNavs({ user, closeSheet }: { user: User | null; closeSheet?: () => void; }) {
  const pathname = usePathname();

  const allNavItems = [...navItems, ...secondaryNavItems];

  if (user && user.email?.endsWith('@rewardspeak.com')) {
    allNavItems.push({ href: "/admin/dashboard", label: "Admin Portal", icon: Shield });
  }

  return (
    <div className="flex-grow overflow-y-auto">
        <nav className="flex-1 space-y-2 p-4">
        {allNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === item.href);
            return (
            <SvgNavButton
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={isActive}
                onClick={closeSheet || (() => {})}
            />
            );
        })}
        </nav>
    </div>
  );
}


function SidebarContent({ user, children, closeSheet }: { user: User | null; children?: React.ReactNode, closeSheet?: () => void; }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-lg font-headline"
          onClick={closeSheet}
        >
          <Image src="/logo.png?v=7" alt="Rewards Peak Logo" width={40} height={40} />
          <span className="text-xl font-bold">Rewards Peak</span>
        </Link>
        {children}
      </div>
        <SidebarNavs user={user} closeSheet={closeSheet} />
       <div className="p-4 border-t flex-shrink-0">
         <form action={signOut}>
            <button
                type="submit"
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm font-bold text-muted-foreground hover:bg-primary hover:text-primary-foreground"
            >
                <LogOut className="h-4 w-4" />
                Log Out
            </button>
        </form>
      </div>
    </div>
  );
}


function MobileSidebar({ user, avatarUrl }: { user: User | null; avatarUrl: string | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const closeSheet = () => setIsOpen(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                      <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M4 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs bg-card p-0">
                 <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                 <div className="flex flex-col h-full">
                    <div className="p-4 border-b flex-shrink-0">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 font-semibold text-lg font-headline"
                            onClick={closeSheet}
                        >
                        <Image src="/logo.png?v=7" alt="Rewards Peak Logo" width={32} height={32} />
                        <span className="text-lg font-bold">Rewards Peak</span>
                        </Link>
                    </div>
                     <div className="p-4 border-b">
                        <div className="flex items-center gap-4">
                            <UserNav user={user} avatarUrl={avatarUrl} />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                    <SidebarNavs user={user} closeSheet={closeSheet} />
                     <div className="p-4 border-t flex-shrink-0">
                        <form action={signOut}>
                            <Button variant="ghost" type="submit" className="w-full justify-start hover:bg-primary hover:text-primary-foreground font-bold">
                                <LogOut className="mr-2 h-4 w-4" />
                                Log Out
                            </Button>
                        </form>
                    </div>
                 </div>
            </SheetContent>
        </Sheet>
    );
}

function Header({ user, totalPoints, withdrawnPoints, avatarUrl }: { user: User | null, totalPoints: number, withdrawnPoints: number, avatarUrl: string | null }) {
    const router = useRouter();
    const pathname = usePathname();
    const isDashboard = pathname === '/dashboard';

    return (
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
             <div className="md:hidden">
                {isDashboard ? (
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                         <Image src="/logo.png?v=7" alt="Rewards Peak Logo" width={32} height={32} />
                    </Link>
                ) : (
                    <Button variant="ghost" size="icon" className="shrink-0" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Go back</span>
                    </Button>
                )}
            </div>
            <div className="flex-1 overflow-x-auto whitespace-nowrap">
                <div className="flex gap-2 items-center">
                {recentEarnings.map((earning, i) => (
                    <div key={i} className="hidden md:flex items-center gap-2 p-2 rounded-md bg-muted/50 text-xs">
                    <div className="flex flex-col">
                        <span className="font-bold text-secondary">{earning.name}</span>
                        <span className="text-muted-foreground">{earning.user}</span>
                    </div>
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

const mobileNavItems = [
    { href: "/withdraw", label: "Cash-Out", icon: Gift },
    { href: "/earn", label: "Earn", icon: DollarSign },
    { href: "/leaderboard", label: "Top Earners", icon: Trophy },
];

const MobileNavItem = ({ item, isActive }: { item: typeof mobileNavItems[0], isActive: boolean }) => (
    <Link
        href={item.href}
        className="group relative flex flex-col items-center justify-center w-full gap-1 p-2 text-xs font-semibold"
    >
        <div className="relative">
            <item.icon className={cn(
                "h-6 w-6 transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )} />
        </div>
        <span className={cn(
            "truncate transition-colors duration-200",
            isActive ? "text-primary" : "text-muted-foreground"
        )}>{item.label}</span>
        {isActive && (
            <div
                className="absolute bottom-0 h-0.5 w-full rounded-full bg-primary"
            />
        )}
    </Link>
);


function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border/50 md:hidden z-50">
            <div className="grid h-full grid-cols-3 items-center">
                 {mobileNavItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                       <MobileNavItem key={item.href} item={item} isActive={isActive} />
                    )
                })}
            </div>
        </div>
    );
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
                <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background overflow-y-auto pb-28 md:pb-8">{children}</main>
              </SidebarInset>
              <MobileBottomNav />
            </div>
          </div>
        </SidebarProvider>
    )
}
