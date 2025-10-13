import { StatCard } from "@/components/stat-card";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { OfferCard } from "@/components/offer-card";
import {
  user,
  popularOffers,
  quickTasks,
  achievements,
} from "@/lib/mock-data";
import {
  Coins,
  Zap,
  ArrowUpRight,
  Shield,
  CalendarCheck,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { DailyRewardModal } from "@/components/daily-reward-modal";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal dashboard on Rewards Peak.",
};

export default function DashboardPage() {
  const dailyGoal = 5000;
  const progress = (user.dailyEarnings / dailyGoal) * 100;
  const nextAchievement = achievements.find(
    (a) => a.currentProgress < a.goal
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}!`}
        description="Here’s your progress. Keep climbing!"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Points"
          value={user.totalPoints}
          icon={Coins}
          description="Your all-time earnings"
        />
        <StatCard
          title="Today's XP"
          value={user.dailyEarnings}
          icon={Zap}
          description="Points earned today"
        />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Daily Quest</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">
              {user.dailyEarnings.toLocaleString()} /{" "}
              {dailyGoal.toLocaleString()} XP
            </div>
            <Progress value={progress} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center justify-center p-4">
          <CalendarCheck className="w-8 h-8 text-primary mb-2" />
          <h3 className="font-semibold text-center mb-2">Daily Login Bonus</h3>
          <DailyRewardModal />
        </Card>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4 font-headline">
              Popular Quests
            </h2>
            <div className="space-y-4">
              {popularOffers.slice(0, 3).map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
          <div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/earn">View All Quests</Link>
            </Button>
          </div>
        </div>
        <div className="space-y-6">
          {nextAchievement && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="text-primary" /> Next Achievement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{nextAchievement.name}</p>
                <p className="text-xs text-muted-foreground mb-2">
                  {nextAchievement.description}
                </p>
                <Progress
                  value={
                    (nextAchievement.currentProgress / nextAchievement.goal) *
                    100
                  }
                  className="h-2"
                />
                <p className="text-xs text-right mt-1 text-muted-foreground">
                  {nextAchievement.currentProgress} / {nextAchievement.goal}
                </p>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Quick Tasks</CardTitle>
              <CardDescription>Complete these for fast XP.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {quickTasks.slice(0, 3).map((task) => (
                  <li key={task.id} className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-sm font-bold text-primary font-headline">
                        {task.points} pts
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href="/dashboard/earn">
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
