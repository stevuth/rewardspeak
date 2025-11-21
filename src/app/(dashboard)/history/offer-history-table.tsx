'use client';

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/safe-image";
import type { OfferProgress } from './page';
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Trophy, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";

const StatusBadge = ({ status }: { status: OfferProgress["status"] }) => {
    if (status === "completed") {
        return (
            <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border-emerald-500/20 px-3 py-1 rounded-full transition-colors">
                <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                Completed
            </Badge>
        );
    }
    return (
        <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20 px-3 py-1 rounded-full transition-colors">
            <Clock className="mr-1.5 h-3.5 w-3.5" />
            In Progress
        </Badge>
    );
};

const OfferRow = ({ offer }: { offer: OfferProgress }) => {
    const [isOpen, setIsOpen] = useState(false);
    const totalEvents = offer.offer_details.events?.length || 0;
    const completedEvents = offer.completed_event_ids?.length || 0;
    const progress = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;

    return (
        <Card className="group overflow-hidden border-border/50 bg-card/50 hover:bg-card/80 hover:border-primary/20 transition-all duration-300">
            <div className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className="relative flex-shrink-0">
                    <SafeImage
                        src={offer.offer_details.image_url}
                        alt={offer.offer_details.name}
                        width={64}
                        height={64}
                        className="rounded-xl border border-border/50 shadow-sm group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 border border-border shadow-sm">
                        <div className="bg-primary/10 p-1 rounded-full">
                            <Trophy className="h-3 w-3 text-primary" />
                        </div>
                    </div>
                </div>

                <div className="flex-grow space-y-3 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h3 className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">
                                {offer.offer_details.name}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                <span className="bg-secondary/50 px-2 py-0.5 rounded text-secondary-foreground font-medium">
                                    {offer.offer_details.network}
                                </span>
                                <span>&bull;</span>
                                <span>Started {new Date(offer.started_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <StatusBadge status={offer.status} />
                    </div>

                    {totalEvents > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-medium">
                                <span className="text-muted-foreground">Progress</span>
                                <span className={cn(progress === 100 ? "text-emerald-500" : "text-primary")}>
                                    {Math.round(progress)}%
                                </span>
                            </div>
                            <Progress value={progress} className="h-2 bg-secondary/50" indicatorClassName={cn(progress === 100 ? "bg-emerald-500" : "bg-primary")} />
                        </div>
                    )}
                </div>

                {totalEvents > 0 && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex-shrink-0 self-center sm:self-auto h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                        {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                        <span className="sr-only">Toggle Milestones</span>
                    </Button>
                )}
            </div>

            {isOpen && totalEvents > 0 && (
                <CardContent className="px-5 pb-5 pt-0 animate-in slide-in-from-top-2 duration-200">
                    <div className="bg-secondary/20 rounded-xl p-1 border border-border/50">
                        <div className="space-y-1">
                            {offer.offer_details.events.map((event, index) => {
                                const isCompleted = offer.completed_event_ids?.includes(String(event.id));
                                const points = Math.round((event.payout || 0) * 1000);

                                return (
                                    <div key={event.id} className={cn(
                                        "flex items-center justify-between p-3 rounded-lg transition-all",
                                        isCompleted ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "hover:bg-background/50 text-muted-foreground"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-6 w-6 rounded-full flex items-center justify-center border",
                                                isCompleted ? "bg-emerald-500 text-white border-emerald-500" : "border-muted-foreground/30 bg-background"
                                            )}>
                                                {isCompleted ? <CheckCircle className="h-3.5 w-3.5" /> : <div className="h-2.5 w-2.5 rounded-full border border-muted-foreground/50" />}
                                            </div>
                                            <p className="text-sm font-medium">{event.name}</p>
                                        </div>
                                        <div className="text-right font-mono text-sm">
                                            <span className="font-bold text-emerald-500">
                                                +{points.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground ml-1">PTS</span>
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
