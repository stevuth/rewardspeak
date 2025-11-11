
'use client';

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Gift, Users, DollarSign, Check, Percent, Twitter, Facebook, Instagram } from "lucide-react";
import { GiftIllustration } from "@/components/illustrations/gift";
import { StatCard } from "@/components/stat-card";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  TwitterShareButton,
  FacebookShareButton,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';
import { Separator } from "@/components/ui/separator";
import Link from "next/link";


export default function InviteAndClimbPage() {
  const [referralCode, setReferralCode] = useState('GUEST');
  const [userId, setUserId] = useState<string | null>(null);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfileAndReferrals = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // Fetch the user's profile to get their short ID referral code and earnings
        const { data: profile } = await supabase
            .from('profiles')
            .select('id, referral_earnings')
            .eq('user_id', user.id)
            .single();

        if (profile) {
            setReferralCode(profile.id);
            setReferralEarnings(profile.referral_earnings || 0);
        }
        
        // Fetch the count of referrals made by this user
        if (profile) {
            const { count } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('referred_by', profile.id);
            setTotalReferrals(count || 0);
        }
      }
    };
    fetchProfileAndReferrals();
  }, []);

  const referralLink = `https://rewardspeak.com/join?ref=${referralCode}`;
  const shareTitle = "Join me on Rewards Peak and get a $1 bonus!";
  const shareBody = `I'm earning real cash on Rewards Peak by playing games and completing tasks. Sign up with my link to get a $1 welcome bonus! 🚀`;


  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied to clipboard!",
      description: "Your referral link is ready to be shared.",
      icon: <Check className="text-green-500" />,
    });
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied to clipboard!",
      description: "Your referral code is ready to be shared.",
      icon: <Check className="text-green-500" />,
    });
  };


  return (
    <div className="space-y-8">
      <PageHeader
        description="Share your code to earn a percentage of what your friends make, for life."
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
          value={`${referralEarnings.toLocaleString()} Pts`}
          icon={Gift}
          description="Total points earned from your referrals' activity."
        />
      </div>

      <div className="container mx-auto flex flex-col items-center justify-center text-center py-10 md:py-16 bg-card rounded-lg">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">
          The Ultimate Referral Program
        </h2>
        
        <div className="flex items-center gap-2 my-4 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-lg">
            <Percent className="h-5 w-5" />
            <span>Earn 10% of your friends' earnings, for life!</span>
        </div>

        <div className="my-8">
          <GiftIllustration />
        </div>

        <div className="w-full max-w-md space-y-6">
          <div>
            <p className="text-muted-foreground mb-2">Your unique referral code:</p>
            <div className="relative flex items-center">
              <Input
                id="referral-code"
                type="text"
                value={referralCode}
                readOnly
                className="pr-12 bg-muted border-dashed text-center text-lg font-mono tracking-widest"
              />
              <Button variant="ghost" size="icon" className="absolute right-1" onClick={handleCopyCode}>
                <Copy className="h-5 w-5" />
              </Button>
            </div>
          </div>
        
          <div>
            <p className="text-muted-foreground mb-2">Or share your referral link:</p>
            <div className="relative flex items-center">
              <Input
                id="referral-link"
                type="text"
                value={referralLink}
                readOnly
                className="pr-12 bg-muted border-dashed"
              />
              <Button variant="ghost" size="icon" className="absolute right-1" onClick={handleCopyLink}>
                <Copy className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div>
             <p className="text-muted-foreground mb-4">Share with your friends</p>
             <div className="flex justify-center gap-4">
                 <TwitterShareButton url={referralLink} title={shareBody} hashtags={["RewardsPeak", "EarnMoney"]}>
                    <div className="flex items-center justify-center h-12 w-12 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                        <Twitter className="h-5 w-5" />
                    </div>
                 </TwitterShareButton>
                  <FacebookShareButton url={referralLink} quote={shareBody} hashtag="#RewardsPeak">
                     <div className="flex items-center justify-center h-12 w-12 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                        <Facebook className="h-5 w-5" />
                    </div>
                 </FacebookShareButton>
                 <WhatsappShareButton url={referralLink} title={shareBody}>
                    <WhatsappIcon size={48} round />
                 </WhatsappShareButton>
                  <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                        <Instagram className="h-5 w-5" />
                    </div>
                  </Link>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
