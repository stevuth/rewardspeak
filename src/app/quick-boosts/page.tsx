import { PageHeader } from "@/components/page-header";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quick Boosts",
  description: "Short, fast-reward activities (installs, clicks, sign-ups).",
};

export default function QuickBoostsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Quick Boosts"
        description="Short, fast-reward activities like installs, clicks, and sign-ups."
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page is under construction. Check back later for quick boosts!</p>
        </CardContent>
      </Card>
    </div>
  );
}
