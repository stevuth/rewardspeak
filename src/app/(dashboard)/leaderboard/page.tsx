
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
import { Crown, Medal, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { EmptyPodium } from "@/components/illustrations/empty-podium";

export const runtime = 'edge';
export const revalidate = 3600; // Revalidate every hour

type LeaderboardUser = {
  rank: number;
  name: string;
  points: number;
  avatarUrl: string;
  avatarHint: string;
  prize?: number;
};

async function getLeaderboardData(): Promise<LeaderboardUser[]> {
    const supabase = createSupabaseServerClient();
    // Rank users by their current points balance
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, points, email, avatar_url')
        .order('points', { ascending: false })
        .limit(100);

    if (error) {
        console.error("Error fetching leaderboard data:", error);
        return [];
    }

    return profiles.map((profile, index) => {
        const rank = index + 1;
        const name = profile.email?.split('@')[0] || `User-${profile.id}`;
        const points = profile.points || 0;
        // Calculate prize based on points: 1000 points = $1
        const prize = rank <= 3 ? points / 1000 : undefined;
        return {
            rank: rank,
            name: name,
            points: points,
            avatarUrl: profile.avatar_url || `https://picsum.photos/seed/user${rank}/96/96`,
            avatarHint: "person portrait",
            prize: prize,
        }
    });
}

function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const PodiumCard = ({ user, rank }: { user: LeaderboardUser; rank: number }) => {
    const isFirst = rank === 1;
    const isSecond = rank === 2;
    const isThird = rank === 3;
  
    return (
      <Card
        className={cn(
          "flex flex-col items-center text-center p-6 relative transition-all duration-300",
          isFirst && "bg-secondary/10 border-secondary/50 -translate-y-4 shadow-lg shadow-secondary/20",
          (isSecond || isThird) && "bg-card/80"
        )}
      >
        {isFirst && <Crown className="absolute -top-3 h-6 w-6 text-secondary" />}
        {isSecond && <Medal className="absolute top-2 right-2 h-5 w-5 text-gray-400" />}
        {isThird && <Medal className="absolute top-2 right-2 h-5 w-5 text-orange-400" />}

        <Avatar className="w-24 h-24 mb-4 border-4 border-secondary/20 text-4xl font-bold">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <p className="font-bold text-lg text-secondary">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.points.toLocaleString()} Points</p>
        {user.prize !== undefined && (
            <div className="mt-4 flex items-center gap-2 bg-secondary/20 text-secondary font-bold px-4 py-1.5 rounded-full">
                <span>${user.prize?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
        )}
        <Badge className="mt-4">{getOrdinal(user.rank)}</Badge>
      </Card>
    );
};

const RankBadge = ({ rank }: { rank: number }) => {
    if (rank <= 3) return null;
    return <Badge variant="secondary">{getOrdinal(rank)}</Badge>;
};

export default async function TopEarnersPage() {
    const leaderboardData = await getLeaderboardData();
    const topThree = leaderboardData.slice(0, 3);
    const restOfLeaderboard = leaderboardData.slice(3);

  return (
    <div className="space-y-8">
      <PageHeader
        description="A salute to our top earners. See who's leading the pack on the climb to the top."
      />
      
      {topThree.length >= 3 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mt-12">
            <div className="order-2 md:order-1">
                <PodiumCard user={topThree[1]} rank={2} />
            </div>
            <div className="order-1 md:order-2">
                <PodiumCard user={topThree[0]} rank={1} />
            </div>
            <div className="order-3 md:order-3">
                <PodiumCard user={topThree[2]} rank={3} />
            </div>
      </div>
      ) : (
        <Card className="text-center py-12">
            <CardContent className="p-0">
                <EmptyPodium />
            </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <PageHeader title="Leaderboard" description="A list of the top 100 earners on Rewards Peak." />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restOfLeaderboard.length > 0 ? (
                restOfLeaderboard.map((user) => (
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
                      {user.points.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                        {leaderboardData.length <= 3 ? "More earners are climbing the ranks!" : "The leaderboard is empty. Start earning to get on the board!"}
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
