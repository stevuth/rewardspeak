import { PageHeader } from "@/components/page-header";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Heights",
  description: "Newest earning opportunities added.",
};

export default function NewHeightsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="New Heights"
        description="The newest earning opportunities added just for you."
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page is under construction. Check back later for new offers!</p>
        </CardContent>
      </Card>
    </div>
  );
}
