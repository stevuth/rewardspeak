import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Offer } from "@/lib/mock-data";
import { Swords } from "lucide-react";
import { cn } from "@/lib/utils";

export function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary">
      <CardContent className="p-3">
        <div className="flex items-center gap-4">
          <Image
            src={offer.imageUrl}
            alt={`${offer.partner} logo`}
            width={64}
            height={64}
            className="rounded-lg border-2 border-primary/20"
            data-ai-hint={offer.imageHint}
          />
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <p className="text-sm font-semibold">{offer.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-muted-foreground">{offer.partner}</p>
                <Badge variant="outline" className="hidden sm:inline-flex">{offer.category}</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
               <p className="text-lg font-bold text-primary whitespace-nowrap">
                {offer.points.toLocaleString()} XP
              </p>
              <Button size="sm" className="w-full md:w-auto">
                Start Quest <Swords className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
