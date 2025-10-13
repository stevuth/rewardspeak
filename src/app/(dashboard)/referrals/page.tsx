import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { user, leaderboardData } from "@/lib/mock-data";
import { Copy, Users, Gift } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referrals",
  description: "Invite friends and earn more on Rewards Peak.",
};

export default function ReferralsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Referral Program"
        description="Invite your friends and earn a percentage of their earnings!"
      />
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>
            Share this link with your friends. When they sign up, you earn!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={user.referralLink} readOnly />
            <Button variant="outline" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Friends Referred"
          value={user.referrals}
          icon={Users}
        />
        <StatCard
          title="Referral Earnings"
          value={user.referralEarnings}
          icon={Gift}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {leaderboardData.slice(0, 3).map((refUser, index) => (
              <li key={index} className="flex items-center gap-4">
                <Image
                  src={refUser.avatarUrl}
                  alt={refUser.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                  data-ai-hint={refUser.avatarHint}
                />
                <div className="flex-1">
                  <p className="font-medium">{refUser.name}</p>
                  <p className="text-sm text-muted-foreground">Joined 2 weeks ago</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-primary">+{(refUser.points/100).toLocaleString()} pts</p>
                    <p className="text-sm text-muted-foreground">You earned</p>
                </div>
              </li>
            ))}
          </ul>
           {user.referrals === 0 && (
                <div className="text-center py-10">
                     <p className="text-sm text-muted-foreground">You haven't referred anyone yet.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
