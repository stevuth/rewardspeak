
"use client";

import { useState, useId, useTransition } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { SafeImage } from "@/components/safe-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, EyeOff, Eye, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { setOfferDisabledStatus } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

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
  events: { name: string; payout: number; id: number }[];
  is_disabled: boolean;
};

export function OfferDetailsRow({ offer }: { offer: Offer }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isToggling, startToggleTransition] = useTransition();
  const uniqueId = useId();
  const { toast } = useToast();

  const handleToggle = async () => {
    startToggleTransition(async () => {
      const result = await setOfferDisabledStatus(offer.offer_id, !offer.is_disabled);
      if (result.success) {
        toast({
          title: `Offer ${!offer.is_disabled ? 'Disabled' : 'Enabled'}`,
          description: `"${offer.name}" has been updated.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: result.error || "Could not update the offer status.",
        });
      }
    });
  };

  return (
    <>
      <TableRow className={cn(offer.is_disabled && "bg-muted/30 opacity-60 hover:opacity-100")}>
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
        <TableCell>
            {offer.is_disabled ? (
                <Badge variant="destructive">Disabled</Badge>
            ) : (
                <Badge variant="secondary">Enabled</Badge>
            )}
        </TableCell>
        <TableCell>{offer.network}</TableCell>
        <TableCell>${offer.payout.toFixed(2)}</TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1 max-w-[150px]">
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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-controls={uniqueId}
              aria-expanded={isOpen}
            >
              {isOpen ? "Hide" : "Show"}
              {isOpen ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>
             <Button
                variant={offer.is_disabled ? "outline" : "destructive"}
                size="sm"
                onClick={handleToggle}
                disabled={isToggling}
                className="w-[100px]"
            >
                {isToggling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : offer.is_disabled ? (
                    <>
                        <Eye className="h-4 w-4 mr-2" /> Enable
                    </>
                ) : (
                    <>
                        <EyeOff className="h-4 w-4 mr-2" /> Disable
                    </>
                )}
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow id={uniqueId} className={cn(offer.is_disabled && "bg-muted/30")}>
          <TableCell colSpan={8}>
            <div className="p-4 bg-background/50 rounded-lg space-y-4">
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
                      <div key={event.id} className="flex justify-between items-center bg-card p-2 rounded-md border">
                        <span className="text-xs font-medium">{event.name}</span>
                        <Badge variant="outline">${(event.payout || 0).toFixed(2)}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
