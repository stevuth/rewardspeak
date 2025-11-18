
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/safe-image";
import type { OfferProgress } from './page';
import { cn } from "@/lib/utils";
import { Check, CheckCircle, ChevronDown, ChevronUp, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <>
            <TableRow>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <SafeImage
                            src={offer.offer_details.image_url}
                            alt={offer.offer_details.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                        />
                        <span className="font-medium">{offer.offer_details.name}</span>
                    </div>
                </TableCell>
                <TableCell>{offer.offer_details.network}</TableCell>
                <TableCell>{new Date(offer.started_at).toLocaleDateString()}</TableCell>
                <TableCell><StatusBadge status={offer.status} /></TableCell>
                <TableCell className="text-right">
                    {totalEvents > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
                            {completedEvents}/{totalEvents} milestones
                            {isOpen ? <ChevronUp className="ml-2 h-4 w-4"/> : <ChevronDown className="ml-2 h-4 w-4" />}
                        </Button>
                    )}
                </TableCell>
            </TableRow>
            {isOpen && totalEvents > 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="p-0">
                        <div className="p-4 bg-muted/30">
                            <h4 className="font-semibold mb-3 text-sm">Milestones</h4>
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
                    </TableCell>
                </TableRow>
            )}
        </>
    )
}

export const OfferHistoryTable = ({ offers, emptyState }: { offers: OfferProgress[], emptyState?: React.ReactNode }) => {
  if (offers.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Quest</TableHead>
          <TableHead>Partner</TableHead>
          <TableHead>Date Started</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Progress</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {offers.map((offer) => (
          <OfferRow key={offer.id} offer={offer} />
        ))}
      </TableBody>
    </Table>
  );
}
