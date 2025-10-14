
'use client';
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
import { leaderboardData, type LeaderboardUser } from "@/lib/mock-data";
import Image from "next/image";
import { Award, Crown, Medal } from "lucide-react";
import type { Metadata } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";


const PodiumCard = ({ user, rank }: { user: LeaderboardUser; rank: number }) => {
    const isFirst = rank === 1;
    const isSecond = rank === 2;
    const isThird = rank === 3;
  
    return (
      <Card
        className={cn(
          "flex flex-col items-center text-center p-6 relative transition-all duration-300",
          isFirst && "bg-primary/10 border-primary/50 -translate-y-4 shadow-lg shadow-primary/20",
          (isSecond || isThird) && "bg-card/80"
        )}
      >
        {isFirst && <Crown className="absolute -top-3 h-6 w-6 text-yellow-400" />}
        {isSecond && <Medal className="absolute top-2 right-2 h-5 w-5 text-gray-400" />}
        {isThird && <Medal className="absolute top-2 right-2 h-5 w-5 text-orange-400" />}

        <Avatar className="w-24 h-24 mb-4 border-4 border-primary/20 text-4xl font-bold">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <p className="font-bold text-lg text-primary">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.points.toLocaleString()} Points</p>
        <div className="mt-4 flex items-center gap-2 bg-yellow-400/20 text-yellow-300 font-bold px-4 py-1.5 rounded-full">
            <span>${user.prize?.toLocaleString()}</span>
        </div>
        <Badge className="mt-4">{`#${user.rank}`}</Badge>
      </Card>
    );
  };

const CountdownTimer = () => {
    const calculateTimeLeft = () => {
        const difference = +new Date("2024-12-31") - +new Date();
        let timeLeft: { [key: string]: number } = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const formatTime = (value: number) => value.toString().padStart(2, '0');

    return (
        <div className="text-center my-8">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-2">Leaderboard ends in</h3>
            <div className="flex justify-center items-center gap-2">
                {timeLeft.days !== undefined ? (
                    <>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold p-2 bg-muted rounded-lg">{formatTime(timeLeft.days)}</span>
                            <span className="text-xs text-muted-foreground mt-1">Days</span>
                        </div>
                        <span className="text-3xl font-bold">:</span>
                    </>
                ) : null}
                 <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold p-2 bg-muted rounded-lg">{formatTime(timeLeft.hours || 0)}</span>
                    <span className="text-xs text-muted-foreground mt-1">Hours</span>
                </div>
                <span className="text-3xl font-bold">:</span>
                 <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold p-2 bg-muted rounded-lg">{formatTime(timeLeft.minutes || 0)}</span>
                    <span className="text-xs text-muted-foreground mt-1">Minutes</span>
                </div>
                <span className="text-3xl font-bold">:</span>
                <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold p-2 bg-muted rounded-lg">{formatTime(timeLeft.seconds || 0)}</span>
                    <span className="text-xs text-muted-foreground mt-1">Seconds</span>
                </div>
            </div>
        </div>
    );
}

const RankBadge = ({ rank }: { rank: number }) => {
    if (rank <= 3) return null;
    return <Badge variant="secondary">{rank}th</Badge>;
  };

export default function TopClimbersPage() {
    const topThree = leaderboardData.slice(0, 3);
    const restOfLeaderboard = leaderboardData.slice(3);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Top Climbers"
        description="See who's climbing the highest on Rewards Peak."
      />
      
      {topThree.length >= 3 && (
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
      )}

      <CountdownTimer />

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
