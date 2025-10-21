
'use client';
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";


export default function AboutRewardsPeakPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Button variant="outline" size="icon" className="shrink-0 mb-4" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
        </Button>
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

    
