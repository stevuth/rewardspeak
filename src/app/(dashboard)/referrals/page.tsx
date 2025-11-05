
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
import { Copy, Gift, Users, DollarSign, Check } from "lucide-react";
import { GiftIllustration } from "@/components/illustrations/gift";
import { StatCard } from "@/components/stat-card";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

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
        
        // Use user_id as referral code for simplicity until a dedicated one is needed
        setReferralCode(user.id.substring(0, 8).toUpperCase());
        
        // Fetch the count of referrals made by this user
        const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('referral_code', user.id); // This might need adjustment based on final schema
            
        setTotalReferrals(count || 0);

        // Fetch real referral earnings
        const { data: earnings, error: earningsError } = await supabase.rpc('get_referral_earnings');
         if (earningsError) {
            console.error("Error fetching referral earnings: ", earningsError);
        } else {
            setReferralEarnings(earnings ?? 0);
        }
      }
    };
    fetchProfileAndReferrals();
  }, []);

  const referralLink = `https://rewardspeak.com/join?ref=${referralCode}`;

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
        title="Invite & Earn"
        description="Share your code to earn rewards when your friends join and earn."
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
          value={`${referralEarnings} Pts`}
          icon={Gift}
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

        <div className="w-full max-w-sm space-y-6">
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
          
          <Button size="lg" className="w-full" onClick={handleCopyLink}>
            <Copy className="mr-2 h-4 w-4" /> Copy Your Link
          </Button>
        </div>
      </div>
    </div>
  );
}
