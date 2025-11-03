
"use client";

import { useState, useId } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { SafeImage } from "@/components/safe-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Define a more specific type for the offer object
type Offer = {
  offer_id: string;
  name: string;
  image_url: string;
  network: string;
  payout: number;
  countries: string[];
  platforms: string[];
  categories: string[];
  description: string;
  click_url: string;
  events: { name: string; payout: number; id: number }[]; // Stricter type for events
};

export function OfferDetailsRow({ offer }: { offer: Offer }) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();

  return (
    <Collapsible asChild>
        <>
          <TableRow>
            <TableCell>
              <SafeImage
                src={offer.image_url}
                alt={offer.name}
                width={40}
                height={40}
                className="rounded-md object-cover"
              />
            </TableCell>
            <TableCell className="font-medium max-w-xs truncate">{offer.name}</TableCell>
            <TableCell>{offer.network}</TableCell>
            <TableCell>${offer.payout.toFixed(2)}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1 max-w-xs">
                {(offer.countries || []).map((country: string) => (
                  <Badge key={country}>{country}</Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {(offer.platforms || []).map((platform: string) => (
                  <Badge variant="secondary" key={platform}>
                    {platform}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {(offer.categories || []).map((category: string) => (
                  <Badge variant="outline" key={category}>
                    {category}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-controls={uniqueId}
                  aria-expanded={isOpen}
                >
                  {isOpen ? "Hide" : "Show"} Details
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 ml-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-2" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </TableCell>
          </TableRow>
          
          <CollapsibleContent asChild>
            <tr id={uniqueId}>
                <td colSpan={8}>
                  <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm">Offer ID</h4>
                      <div className="text-xs text-muted-foreground">
                        <Badge variant="secondary">{offer.offer_id}</Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Description</h4>
                      <div
                        className="text-xs text-muted-foreground prose prose-sm prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: offer.description }}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Click URL</h4>
                      <a
                        href={offer.click_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline break-all"
                      >
                        {offer.click_url}
                      </a>
                    </div>
                    {offer.events && offer.events.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Events (Milestones)</h4>
                        <div className="space-y-2">
                            {offer.events.map((event) => (
                                <div key={event.id} className="flex justify-between items-center bg-background p-2 rounded-md border">
                                    <span className="text-xs font-medium">{event.name}</span>
                                    <Badge variant="outline">${(event.payout || 0).toFixed(2)}</Badge>
                                </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
            </tr>
          </CollapsibleContent>
        </>
    </Collapsible>
  );
}
