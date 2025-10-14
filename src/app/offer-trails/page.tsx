import { PageHeader } from "@/components/page-header";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offer Trails",
  description: "Partner offerwalls and sponsored tasks.",
};

export default function OfferTrailsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Offer Trails"
        description="Explore partner offerwalls and sponsored tasks."
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page is under construction. Check back later for offer trails!</p>
        </CardContent>
      </Card>
    </div>
  );
}
