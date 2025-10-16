
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { DollarSign, CheckCircle, Clock } from "lucide-react";
import { OfferCard } from "@/components/offer-card";
import { popularOffers } from "@/lib/mock-data";
import { DailyRewardModal } from "@/components/daily-reward-modal";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Gift, Trophy } from "lucide-react";

export default function DashboardPage() {
    const totalPoints = 0;
    const completedOffersCount = 0;
    const pendingOffersCount = 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Peak Dashboard"
        description="Your mission control for earning rewards."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Points"
          value={totalPoints}
          icon={DollarSign}
          description="Your current redeemable balance."
        />
        <StatCard
          title="Offers Completed"
          value={completedOffersCount}
          icon={CheckCircle}
          description="Quests you've successfully finished."
        />
        <StatCard
          title="Offers Pending"
          value={pendingOffersCount}
          icon={Clock}
          description="Quests awaiting confirmation."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Featured Quests</CardTitle>
                    <CardDescription>Popular offers to get you started.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {popularOffers.slice(0, 3).map(offer => (
                        <OfferCard key={offer.title} offer={offer} />
                    ))}
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
             <Card className="bg-primary/10 border-primary/20 text-center">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 font-headline">
                        <Gift className="text-primary" />
                        Daily Reward
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">Come back every 24 hours to claim your free points!</p>
                    <DailyRewardModal />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy />
                        Leaderboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground text-sm mb-4">See how you stack up against other climbers.</p>
                     <Button asChild className="w-full">
                        <Link href="/leaderboard">View Leaderboard</Link>
                     </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
