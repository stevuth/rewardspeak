import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { achievements, type Achievement } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Track your progress and unlock exclusive rewards.",
};

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  const progress = (achievement.currentProgress / achievement.goal) * 100;
  return (
    <Card
      className={cn(
        "flex flex-col transition-all",
        achievement.unlocked
          ? "border-primary/60 bg-primary/10"
          : "border-border"
      )}
    >
      <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
        <div
          className={cn(
            "w-16 h-16 flex items-center justify-center rounded-lg",
            achievement.unlocked
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground"
          )}
        >
          <achievement.icon className="w-8 h-8" />
        </div>
        <div>
          <CardTitle className="font-headline text-lg">{achievement.name}</CardTitle>
          <CardDescription>{achievement.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        {achievement.unlocked ? (
          <div className="text-center text-primary font-bold">
            Unlocked (+{achievement.reward} XP)
          </div>
        ) : (
          <div>
            <Progress value={progress} className="h-2 mb-1" />
            <p className="text-xs text-right text-muted-foreground">
              {achievement.currentProgress.toLocaleString()} /{" "}
              {achievement.goal.toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function AchievementsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Challenges"
        description="Track your progress and unlock exclusive rewards for your efforts."
      />
      {achievements.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((ach) => (
            <AchievementCard key={ach.id} achievement={ach} />
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No challenges available right now. Check back soon!</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
