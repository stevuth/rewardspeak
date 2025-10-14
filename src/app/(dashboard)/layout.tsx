
"use client";

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
import { user } from "@/lib/mock-data";
import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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

const recentEarnings: any[] = [
];

function SidebarContent({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const getNavLinkClass = (href: string) => {
    const isActive = pathname.startsWith(href) && (href !== '/dashboard' || pathname === href);
    return cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm",
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-muted"
    );
  };
  
  if (isMobile) {
    const mobileOnlyNav = navItems.filter(item => !mobileNavItems.some(mobileItem => mobileItem.href === item.href));
    return (
      <div className="flex flex-col h-full">
         <div className="p-4 border-b flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold text-lg font-headline"
            >
              <Coins className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Rewards Peak</span>
            </Link>
            {children}
          </div>
        <nav className="flex-1 space-y-1 p-4">
           {mobileOnlyNav.map((item) => (
             <Link
               key={item.href}
               href={item.href}
               className={getNavLinkClass(item.href)}
             >
               <item.icon className="h-4 w-4" />
               {item.label}
             </Link>
           ))}
            <Link href="/history" className={getNavLinkClass("/history")}><Clock className="h-4 w-4" />Quest Log</Link>
            <Link href="/support" className={getNavLinkClass("/support")}><CircleHelp className="h-4 w-4" />Help Station</Link>
        </nav>
        <div className="mt-auto p-4 border-t space-y-2">
            <Link href="/settings" className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground">
                <Image 
                    src={user.avatarUrl} 
                    alt="user avatar" 
                    width={32}
                    height={32}
                    className="rounded-full"
                    data-ai-hint={user.avatarHint}
                />
                <span>{user.name}</span>
            </Link>
             <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm text-muted-foreground hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Link>
        </div>
      </div>
    );
  }

  // Desktop Sidebar
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-lg font-headline"
        >
          <Coins className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Rewards Peak</span>
        </Link>
      </div>

      <div className="p-4 flex items-center gap-4 bg-muted/50 border-b">
        <div className="relative h-12 w-12 shrink-0">
            <Image 
                src={user.avatarUrl} 
                alt="user avatar" 
                layout="fill"
                className="rounded-full border-2 border-primary/50"
                data-ai-hint={user.avatarHint}
            />
        </div>
        <div className="flex-1">
            <p className="font-semibold">{user.name}</p>
            <div className="flex items-center gap-1 text-xs text-yellow-400">
              <Coins className="h-3 w-3" />
              <span>{user.totalPoints.toLocaleString()} (${(user.totalPoints / 100).toFixed(2)})</span>
            </div>
        </div>
      </div>

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
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm text-muted-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Link>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[260px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <SidebarContent />
      </div>
      <div className="flex flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
          <Button variant="outline" size="icon" className="shrink-0 md:hidden" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
          </Button>
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
            <UserNav />
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
              <SheetContent side="left" className="flex flex-col p-0 bg-card w-[80vw] max-w-xs"
               hideCloseButton={true}
              >
                <SidebarContent>
                   <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="md:hidden">
                          <X className="h-5 w-5" />
                          <span className="sr-only">Close</span>
                      </Button>
                  </SheetClose>
                </SidebarContent>
              </SheetContent>
            </Sheet>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background overflow-y-auto pb-20 md:pb-8">{children}</main>
        
        {/* Mobile Bottom Navigation */}
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
      </div>
    </div>
  );
}
