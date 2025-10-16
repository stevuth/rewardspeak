
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {StatCard} from '@/components/stat-card';
import {
  Users,
  DollarSign,
  Zap,
  Gift,
  Trophy,
  PlusCircle,
} from 'lucide-react';
import {OfferCard} from '@/components/offer-card';
import {leaderboardData, popularOffers, quickTasks} from '@/lib/mock-data';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {DailyRewardModal} from '@/components/daily-reward-modal';
import {PageHeader} from '@/components/page-header';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalPoints = 12530;
  const totalAmountEarned = 125.3;
  const referrals = 12;

  const topThree = leaderboardData.slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Peak Dashboard"
        description="Here’s a snapshot of your journey on Rewards Peak today."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Your Points"
          value={totalPoints}
          icon={Zap}
          description="Your current point balance."
        />
        <StatCard
          title="Total Earned"
          value={`$${totalAmountEarned.toFixed(2)}`}
          icon={DollarSign}
          description="Lifetime earnings."
        />
        <StatCard
          title="Referrals"
          value={referrals}
          icon={Users}
          description="Friends who joined via your link."
        />
        <Card className="flex flex-col items-center justify-center text-center p-4">
          <Gift className="w-8 h-8 text-primary mb-2" />
          <h3 className="font-semibold text-sm">Daily Reward</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Claim your daily bonus!
          </p>
          <DailyRewardModal />
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Popular Offers</CardTitle>
              <CardDescription>
                Quests that other climbers are currently enjoying.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {popularOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Tasks</CardTitle>
              <CardDescription>
                Earn points quickly with these simple quests.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickTasks.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Leaderboard</CardTitle>
                  <CardDescription>Top 3 earners this week.</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/leaderboard">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Climber</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topThree.map((user) => (
                    <TableRow key={user.rank}>
                      <TableCell>
                        <Badge
                          variant={user.rank === 1 ? 'default' : 'secondary'}
                        >
                          #{user.rank}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={user.avatarUrl}
                              alt={user.name}
                              data-ai-hint={user.avatarHint}
                            />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-xs">
                            {user.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {user.points.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
           <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Invite Friends</span>
                    <Users className="w-5 h-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Earn a 10% lifetime commission from your referrals' earnings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/referrals">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Get Invite Link
                  </Link>
                </Button>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
