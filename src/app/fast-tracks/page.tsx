import { PageHeader } from "@/components/page-header";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fast Tracks",
  description: "Quick-completion offers for instant reward.",
};

export default function FastTracksPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Fast Tracks"
        description="Quick-completion offers for instant reward."
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page is under construction. Check back later for fast track offers!</p>
        </CardContent>
      </Card>
    </div>
  );
}
