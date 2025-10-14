import { PageHeader } from "@/components/page-header";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Survey Summit",
  description: "Earn by completing surveys and sharing opinions.",
};

export default function SurveySummitPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Survey Summit"
        description="Earn by completing surveys and sharing your valuable opinions."
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page is under construction. Check back later for surveys!</p>
        </CardContent>
      </Card>
    </div>
  );
}
