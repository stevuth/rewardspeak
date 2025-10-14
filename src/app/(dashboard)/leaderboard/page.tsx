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
import { leaderboardData } from "@/lib/mock-data";
import Image from "next/image";
import { Award } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Climbers",
  description: "Leaderboard showing the highest earners.",
};

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1)
    return <Badge className="bg-yellow-400 hover:bg-yellow-400 text-yellow-900"><Award className="mr-1 h-4 w-4" />1st</Badge>;
  if (rank === 2)
    return <Badge className="bg-gray-300 hover:bg-gray-300 text-gray-800"><Award className="mr-1 h-4 w-4" />2nd</Badge>;
  if (rank === 3)
    return <Badge className="bg-orange-400 hover:bg-orange-400 text-orange-900"><Award className="mr-1 h-4 w-4" />3rd</Badge>;
  return <Badge variant="secondary">{rank}th</Badge>;
};

export default function TopClimbersPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Top Climbers"
        description="See who's climbing the highest on Rewards Peak."
      />
      <Card>
        <CardHeader>
          <CardTitle>Top Earners</CardTitle>
          <CardDescription>This is a list of the top 100 earners this month.</CardDescription>
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
              {leaderboardData.length > 0 ? (
                leaderboardData.map((user) => (
                  <TableRow key={user.rank}>
                    <TableCell>
                      <RankBadge rank={user.rank} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={user.avatarUrl}
                          alt={user.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                          data-ai-hint={user.avatarHint}
                        />
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      {user.points.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                        The leaderboard is empty. Start earning to get on the board!
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
