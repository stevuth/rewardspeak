
'use client';

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/safe-image";
import type { OfferProgress } from './page';
import { cn } from "@/lib/utils";
import { Check, CheckCircle, Plus, Minus, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const StatusBadge = ({ status }: { status: OfferProgress["status"] }) => {
  if (status === "completed") {
    return (
      <Badge className="bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30">
        <CheckCircle className="mr-1 h-3 w-3" />
        Completed
      </Badge>
    );
  }
  return <Badge variant="secondary">In Progress</Badge>;
};

const OfferRow = ({ offer }: { offer: OfferProgress }) => {
    const [isOpen, setIsOpen] = useState(false);
    const totalEvents = offer.offer_details.events?.length || 0;
    const completedEvents = offer.completed_event_ids?.length || 0;

    return (
        <Card className="overflow-hidden transition-all hover:border-primary/20">
            <CardHeader className="p-4 flex flex-row items-center gap-4 space-y-0">
                <SafeImage
                    src={offer.offer_details.image_url}
                    alt={offer.offer_details.name}
                    width={56}
                    height={56}
                    className="rounded-lg border-2 border-primary/20"
                />
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <div className="sm:col-span-2">
                        <p className="font-semibold">{offer.offer_details.name}</p>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            <span>{offer.offer_details.network}</span>
                            <span>&bull;</span>
                            <span>Started: {new Date(offer.started_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-start sm:justify-end gap-4">
                        <StatusBadge status={offer.status} />
                         {totalEvents > 0 && (
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="h-8 w-8">
                                {isOpen ? <Minus className="h-4 w-4"/> : <Plus className="h-4 w-4" />}
                                <span className="sr-only">Toggle Milestones</span>
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            {isOpen && totalEvents > 0 && (
                 <CardContent className="p-4 pt-0">
                    <div className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-semibold mb-3 text-sm">Milestones ({completedEvents}/{totalEvents})</h4>
                        <div className="space-y-2">
                            {offer.offer_details.events.map(event => {
                                const isCompleted = offer.completed_event_ids?.includes(String(event.id));
                                const points = Math.round((event.payout || 0) * 1000);
                                
                                return (
                                    <div key={event.id} className={cn(
                                        "flex items-center justify-between p-3 rounded-lg border",
                                        isCompleted ? "bg-green-500/10 border-green-500/20 text-foreground" : "bg-card/50 border-border"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            {isCompleted ? <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" /> : <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
                                            <p className="text-sm font-medium">{event.name}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-4">
                                            <p className={cn("font-bold", isCompleted ? "text-green-400" : "text-secondary")}>
                                                +{points.toLocaleString()} Pts
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}

export const OfferHistoryTable = ({ offers, emptyState }: { offers: OfferProgress[], emptyState?: React.ReactNode }) => {
  if (offers.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div className="space-y-4">
        {offers.map((offer) => (
          <OfferRow key={offer.id} offer={offer} />
        ))}
    </div>
  );
}
