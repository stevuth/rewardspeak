import { PageHeader } from "@/components/page-header";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Rewards Peak",
  description: "Story, mission, and trust section.",
};

export default function AboutRewardsPeakPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
        <PageHeader
            title="About Rewards Peak"
            description="Our story, mission, and commitment to you."
        />
        <Card>
            <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-muted-foreground">This page is under construction. Check back later to learn more about Rewards Peak!</p>
            </CardContent>
        </Card>
        </div>
    </div>
  );
}
