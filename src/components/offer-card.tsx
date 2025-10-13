import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Offer } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";

export function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-4 flex items-center gap-4">
        <Image
          src={offer.imageUrl}
          alt={`${offer.partner} logo`}
          width={48}
          height={48}
          className="rounded-lg"
          data-ai-hint={offer.imageHint}
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold">{offer.title}</p>
              <p className="text-xs text-muted-foreground">{offer.partner}</p>
            </div>
             <Badge variant="outline" className="hidden sm:inline-flex">{offer.category}</Badge>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-lg font-bold text-primary">
              {offer.points.toLocaleString()} pts
            </p>
            <Button size="sm" variant="ghost">
              Start <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
