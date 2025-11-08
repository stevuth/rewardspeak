
'use client';

import Link from "next/link";
import Image from "next/image";
import { LogOut, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/auth/actions";


function SupportHeader() {
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b bg-card px-4 sm:px-6 py-2">
       <Link href="/support/dashboard" className="flex items-center gap-2 font-semibold">
          <LifeBuoy className="h-8 w-8 text-primary" />
          <span className="text-xl">Support Portal</span>
      </Link>
      <form action={handleLogout}>
        <Button variant="destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
        </Button>
      </form>
    </header>
  );
}

export default function SupportDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SupportHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
