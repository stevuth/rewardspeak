import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { user } from "@/lib/mock-data";
import { Copy, Gift, Users } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import { GiftIllustration } from "@/components/illustrations/gift";

export const metadata: Metadata = {
  title: "Invite & Climb",
  description: "Your referral and bonus page (share link, track earnings).",
};

export default function InviteAndClimbPage() {
  const referralCode = user.referralLink.split("/").pop()?.toUpperCase();

  return (
    <div className="container mx-auto flex flex-col items-center justify-center text-center py-10 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold">Refer and earn</h1>

      <div className="my-8">
        <GiftIllustration />
      </div>

      <div className="w-full max-w-sm">
        <p className="text-muted-foreground mb-2">Your referral code:</p>
        <div className="relative flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 p-4">
          <span className="text-2xl font-bold tracking-widest text-primary">
            {referralCode}
          </span>
          <Button variant="ghost" size="icon" className="absolute right-2">
            <Copy className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-muted-foreground mt-6 mb-8">
          Share your referral code with your friends and get benefits.
        </p>

        <Button size="lg" className="w-full">
          Invite friends
        </Button>
      </div>
    </div>
  );
}
