import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { offerWalls, popularOffers, quickTasks } from "@/lib/mock-data";
import {
  Mountain,
  FileText,
  Zap,
  TrendingUp,
  PlusCircle,
  Rocket,
  ChevronRight,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Climb & Earn",
  description:
    "Main earning hub that leads to all available earning opportunities.",
};

const earningCategories = [
  {
    href: "/survey-summit",
    label: "Survey Summit",
    icon: FileText,
    description: "Share your opinions and earn.",
  },
  {
    href: "/offer-trails",
    label: "Offer Trails",
    icon: Mountain,
    description: "Explore tasks from our partners.",
  },
  {
    href: "/quick-boosts",
    label: "Quick Boosts",
    icon: Zap,
    description: "Fast rewards for simple tasks.",
  },
  {
    href: "/trending-peaks",
    label: "Trending Peaks",
    icon: TrendingUp,
    description: "Popular and high-paying offers.",
  },
  {
    href: "/new-heights",
    label: "New Heights",
    icon: PlusCircle,
    description: "The latest earning opportunities.",
  },
  {
    href: "/fast-tracks",
    label: "Fast Tracks",
    icon: Rocket,
    description: "Quick-completion offers.",
  },
];

export default function ClimbAndEarnPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Climb & Earn"
        description="Your main hub for all earning opportunities on Rewards Peak."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {earningCategories.map((category) => (
          <Card
            key={category.href}
            className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary"
          >
            <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <category.icon className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="font-headline text-lg">
                  {category.label}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
              <Button asChild className="w-full">
                <Link href={category.href}>
                  Explore <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
