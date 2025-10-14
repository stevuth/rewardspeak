import { PageHeader } from "@/components/page-header";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Trail",
  description: "Privacy Policy for Rewards Peak.",
};

export default function PrivacyTrailPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
        <PageHeader
            title="Privacy Trail"
            description="Our commitment to your privacy."
        />
        <Card>
            <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-muted-foreground">Our Privacy Policy is being drafted. Please check back soon.</p>
            </CardContent>
        </Card>
        </div>
    </div>
  );
}
