
import { PageHeader } from "@/components/page-header";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

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
        logoHint: "timewall logo",
        bgColor: "bg-green-500"
    }
]

const OfferwallCard = ({ wall }: { wall: typeof offerwalls[0] }) => (
    <Link href={`/offerwalls/${wall.slug}`} className="block group">
        <Card className={cn("relative overflow-hidden h-48 flex flex-col items-center justify-center text-white transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl", wall.bgColor)}>
            <Image
                src={wall.logoUrl}
                alt={`${wall.name} logo`}
                width={120}
                height={60}
                className="object-contain"
                data-ai-hint={wall.logoHint}
            />
            <div className="absolute bottom-4">
                 <div className="bg-black/20 text-white text-xs font-semibold px-4 py-1.5 rounded-md backdrop-blur-sm">
                    {wall.name}
                 </div>
            </div>
        </Card>
    </Link>
);


export default function OfferwallsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Offer Providers"
        description="Explore a variety of offers from our trusted partners."
      />
       <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {offerwalls.map((wall) => (
            <CarouselItem key={wall.slug} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
              <OfferwallCard wall={wall} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 -left-4 hidden lg:flex" />
        <CarouselNext className="absolute top-1/2 -translate-y-1/2 -right-4 hidden lg:flex" />
      </Carousel>
    </div>
  );
}
