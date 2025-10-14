import { PageHeader } from "@/components/page-header";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trending Peaks",
  description: "Popular or high-paying offers of the week.",
};

export default function TrendingPeaksPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Trending Peaks"
        description="Popular or high-paying offers of the week."
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page is under construction. Check back later for trending offers!</p>
        </CardContent>
      </Card>
    </div>
  );
}
