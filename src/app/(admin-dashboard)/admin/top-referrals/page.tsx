
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { UserPlus } from "lucide-react";

export const revalidate = 3600; // Revalidate every hour

type TopReferrer = {
  rank: number;
  name: string;
  referral_earnings: number;
  avatarUrl: string;
  avatarHint: string;
};

async function getTopReferralsData(): Promise<TopReferrer[]> {
    const supabase = createSupabaseServerClient();
    // Rank users by their referral earnings
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, referral_earnings, email')
        .gt('referral_earnings', 0) // Only show users who have earned from referrals
        .order('referral_earnings', { ascending: false })
        .limit(100);

    if (error) {
        console.error("Error fetching top referrals data:", error);
        return [];
    }

    return profiles.map((profile, index) => {
        return {
            rank: index + 1,
            name: profile.email?.split('@')[0] || `User-${profile.id}`,
            referral_earnings: profile.referral_earnings || 0,
            avatarUrl: `https://picsum.photos/seed/ref${index + 1}/96/96`,
            avatarHint: "person portrait",
        }
    });
}

function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const RankBadge = ({ rank }: { rank: number }) => {
    return <Badge variant="secondary">{getOrdinal(rank)}</Badge>;
  };

export default async function TopReferralsPage() {
    const topReferrals = await getTopReferralsData();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Top Referrals Leaderboard"
        description="See who is driving the most growth through referrals, ranked by lifetime referral earnings."
        icon={UserPlus}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Top 100 Referrers</CardTitle>
          <CardDescription>A list of the top 100 referrers on Rewards Peak.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Referral Earnings (Points)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topReferrals.length > 0 ? (
                topReferrals.map((user) => (
                  <TableRow key={user.rank}>
                    <TableCell>
                      <RankBadge rank={user.rank} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                            src={user.avatarUrl}
                            alt={user.name}
                            data-ai-hint={user.avatarHint}
                            />
                             <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-secondary">
                      {user.referral_earnings.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                        The referrals leaderboard is empty. No users have earned referral bonuses yet.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
