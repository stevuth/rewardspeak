
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SafeImage } from "./safe-image";
import { Badge } from "./ui/badge";
import { ArrowRight, CheckCircle, Circle, Rocket } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

type Offer = {
  id: string;
  title: string;
  partner: string;
  points: number;
  imageUrl: string;
  imageHint: string;
  category: string;
  clickUrl: string;
  description: string;
  events?: { id: number; name: string; payout: number }[];
};

type OfferMilestoneModalProps = {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer;
};

export function OfferMilestoneModal({ isOpen, onClose, offer }: OfferMilestoneModalProps) {
  const totalPointsFromEvents = offer.events?.reduce((sum, event) => sum + Math.round(event.payout * 100), 0) || offer.points;
  const totalDollarValue = (totalPointsFromEvents / 100).toFixed(2);

  // Simulate some completed steps for visual demonstration
  const completedStepNames = ["Register", "Reach 100 meters drop depth", "Register."];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] sm:max-w-lg bg-gradient-to-br from-[#15002B] to-[#240046] border-border/50 text-foreground p-0 rounded-lg flex flex-col max-h-[85vh]">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <SafeImage
              src={offer.imageUrl}
              alt={offer.title}
              width={80}
              height={80}
              className="rounded-lg border-2 border-border/50 flex-shrink-0 mx-auto sm:mx-0"
            />
            <div className="flex-1 text-center sm:text-left">
              <DialogTitle className="text-xl font-bold font-headline">{offer.title}</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">{offer.description}</DialogDescription>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <Badge variant="secondary">{offer.partner}</Badge>
                <Badge variant={offer.category === 'Game' ? 'default' : 'outline'} className="capitalize">
                  {offer.category.toLowerCase()}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 flex-1 min-h-0">
            <h3 className="font-semibold mb-3 text-secondary">Milestones</h3>
            <ScrollArea className="h-full pr-4 -mr-4">
                <div className="space-y-4">
                {(offer.events && offer.events.length > 0) ? (
                    offer.events.map((event, index) => {
                    const isCompleted = completedStepNames.includes(event.name);
                    const points = Math.round(event.payout * 100);
                    const dollarValue = (points / 100).toFixed(2);
                    return (
                        <div key={event.id} className={cn(
                            "flex items-center gap-4 p-3 rounded-lg transition-colors",
                            isCompleted ? "bg-green-500/10 text-green-400" : "bg-muted/50"
                        )}>
                            {isCompleted ? (
                                <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-400" />
                            ) : (
                                <Circle className="h-5 w-5 flex-shrink-0 text-muted-foreground/50" />
                            )}
                            <p className="flex-1 text-sm font-medium">{event.name}</p>
                            <div className="text-right">
                                <span className="font-bold text-sm text-accent whitespace-nowrap">
                                    + {points.toLocaleString()} Pts
                                </span>
                                <p className="text-xs text-muted-foreground">(${dollarValue})</p>
                            </div>
                        </div>
                    );
                    })
                ) : (
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <Rocket className="h-5 w-5 flex-shrink-0 text-primary" />
                        <p className="flex-1 text-sm font-medium">Complete the offer</p>
                         <div className="text-right">
                            <span className="font-bold text-sm text-accent whitespace-nowrap">
                                + {offer.points.toLocaleString()} Pts
                            </span>
                             <p className="text-xs text-muted-foreground">(${(offer.points / 100).toFixed(2)})</p>
                        </div>
                    </div>
                )}
                </div>
            </ScrollArea>
        </div>
        
        <DialogFooter className="bg-black/20 p-4 sm:p-6 flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 rounded-b-lg">
            <div className="flex-1 text-center sm:text-left">
                <p className="text-xs text-muted-foreground">Total Reward</p>
                <p className="text-xl font-bold text-accent">{totalPointsFromEvents.toLocaleString()} Pts (${totalDollarValue})</p>
            </div>
          <Button 
            type="button" 
            size="lg" 
            className="w-full sm:w-auto"
            onClick={() => window.open(offer.clickUrl, '_blank')}
            >
            Start Offer <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
