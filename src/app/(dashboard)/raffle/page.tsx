
import { PageHeader } from "@/components/page-header";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raffle",
  description: "Enter raffles to win big prizes.",
};

export default function RafflePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Raffle"
        description="Enter raffles to win big prizes. More features coming soon!"
        className="text-center"
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">The raffle feature is under construction. Check back later for exciting opportunities to win!</p>
        </CardContent>
      </Card>
    </div>
  );
}
