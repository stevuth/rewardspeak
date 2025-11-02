
import { PageHeader } from "@/components/page-header";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offerwalls",
  description: "Explore offers from our trusted partners.",
};

const offerwalls = [
    {
        slug: "timewall",
        name: "TimeWall",
        description: "Complete tasks, surveys, and more to earn points.",
        logoUrl: "https://timewall.io/img/timewall_logo_on_dark.png",
        logoHint: "timewall logo"
    }
]

export default function OfferwallsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Offerwalls"
        description="Explore a variety of offers from our trusted partners."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offerwalls.map((wall) => (
            <Card key={wall.slug} className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Image
                            src={wall.logoUrl}
                            alt={`${wall.name} logo`}
                            width={120}
                            height={40}
                            className="object-contain"
                            data-ai-hint={wall.logoHint}
                        />
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <CardTitle>{wall.name}</CardTitle>
                    <CardDescription className="mt-2">{wall.description}</CardDescription>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href={`/offerwalls/${wall.slug}`}>
                            Open Offerwall <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
