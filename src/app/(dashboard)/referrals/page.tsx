
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Gift, Users, DollarSign } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import { GiftIllustration } from "@/components/illustrations/gift";
import { StatCard } from "@/components/stat-card";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Invite & Climb",
  description: "Your referral and bonus page (share link, track earnings).",
};

export default async function InviteAndClimbPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let referralCode = 'GUEST';
  let totalReferrals = 0;
  let referralEarnings = 0;

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profile) {
      referralCode = profile.id;
    }
    // TODO: Fetch real referral data
  }

  const referralLink = `https://rewardspeak.com/ref/${referralCode}`;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Invite & Climb"
        description="Share your code to earn rewards when your friends join and climb."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StatCard
          title="Total Referrals"
          value={totalReferrals}
          icon={Users}
          description="Number of users who signed up with your code."
        />
        <StatCard
          title="Referral Earnings"
          value={referralEarnings}
          icon={DollarSign}
          description="Total points earned from your referrals."
        />
      </div>

      <div className="container mx-auto flex flex-col items-center justify-center text-center py-10 md:py-16 bg-card rounded-lg">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">
          Refer and Earn
        </h2>

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
    </div>
  );
}
