'use client';

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/safe-image";
import type { OfferProgress } from './page';
import { cn } from "@/lib/utils";
import { CheckCircle, ChevronDown } from 'lucide-react';

const StatusBadge = ({ status }: { status: OfferProgress["status"] }) => {
    if (status === "completed") {
        return (
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                <CheckCircle className="mr-1 h-3 w-3" />
                Completed
            </Badge>
        );
    }
    return (
        <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            In Progress
        </Badge>
    );
};

const OfferRow = ({ offer }: { offer: OfferProgress }) => {
    const [isOpen, setIsOpen] = useState(false);
    const totalEvents = offer.offer_details.events?.length || 0;
    const completedEvents = offer.completed_event_ids?.length || 0;
    const progress = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;
    const hasEvents = totalEvents > 0;

    return (
        <div className="bg-card border border-border/40 rounded-xl overflow-hidden hover:border-border transition-all">
            <div
                className={cn(
                    "p-5 flex items-start gap-4",
                    hasEvents && "cursor-pointer hover:bg-card/80"
                )}
                onClick={() => hasEvents && setIsOpen(!isOpen)}
            >
                {/* Offer Image */}
                <SafeImage
                    src={offer.offer_details.image_url}
                    alt={offer.offer_details.name}
                    width={56}
                    height={56}
                    className="rounded-lg border border-border/50 flex-shrink-0"
                />

                {/* Offer Details */}
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base truncate">
                                {offer.offer_details.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                <span>{offer.offer_details.network}</span>
                                <span>•</span>
                                <span>{new Date(offer.started_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <StatusBadge status={offer.status} />
                    </div>

                    {/* Progress Bar */}
                    {hasEvents && (
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                    {completedEvents} of {totalEvents} milestones completed
                                </span>
                                <span className={cn(
                                    "font-medium",
                                    progress === 100 ? "text-emerald-500" : "text-primary"
                                )}>
                                    {Math.round(progress)}%
                                </span>
                            </div>
                            <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full transition-all duration-300",
                                        progress === 100 ? "bg-emerald-500" : "bg-primary"
                                    )}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Expand Icon */}
                {hasEvents && (
                    <ChevronDown
                        className={cn(
                            "h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 mt-1",
                            isOpen && "rotate-180"
                        )}
                    />
                )}
            </div>

            {/* Expandable Milestones */}
            {isOpen && hasEvents && (
                <div className="px-5 pb-5 border-t border-border/40 pt-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-2">
                        {offer.offer_details.events.map((event) => {
                            const isCompleted = offer.completed_event_ids?.includes(String(event.id));
                            const points = Math.round((event.payout || 0) * 1000);

                            return (
                                <div
                                    key={event.id}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-lg border transition-all",
                                        isCompleted
                                            ? "bg-emerald-500/5 border-emerald-500/20"
                                            : "bg-secondary/30 border-border/40"
                                    )}
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        {/* Checkbox */}
                                        <div className={cn(
                                            "h-5 w-5 rounded-full border flex items-center justify-center flex-shrink-0",
                                            isCompleted
                                                ? "bg-emerald-500 border-emerald-500"
                                                : "border-muted-foreground/40"
                                        )}>
                                            {isCompleted && <CheckCircle className="h-3 w-3 text-white" />}
                                        </div>

                                        {/* Event Name */}
                                        <p className={cn(
                                            "text-sm font-medium truncate",
                                            isCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                                        )}>
                                            {event.name}
                                        </p>
                                    </div>

                                    {/* Points */}
                                    <div className="text-sm font-semibold text-emerald-500 flex-shrink-0 ml-3">
                                        +{points.toLocaleString()} <span className="text-xs text-muted-foreground">PTS</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export const OfferHistoryTable = ({ offers, emptyState }: { offers: OfferProgress[], emptyState?: React.ReactNode }) => {
    if (offers.length === 0) {
        return <>{emptyState}</>;
    }

    return (
        <div className="space-y-3">
            {offers.map((offer) => (
                <OfferRow key={offer.id} offer={offer} />
            ))}
        </div>
    );
}
