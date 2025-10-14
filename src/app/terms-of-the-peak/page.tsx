import { PageHeader } from "@/components/page-header";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of the Peak",
  description: "Terms of Service for Rewards Peak.",
};

export default function TermsOfThePeakPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
        <PageHeader
            title="Terms of the Peak"
            description="The rules and guidelines for using Rewards Peak."
        />
        <Card>
            <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-muted-foreground">Our Terms of Service are being drafted. Please check back soon.</p>
            </CardContent>
        </Card>
        </div>
    </div>
  );
}
