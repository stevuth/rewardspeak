
'use client';

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WavingMascotLoader } from "@/components/waving-mascot-loader";
import { QuestMap } from "@/components/illustrations/quest-map";
import { History, Clock, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OfferHistoryTable } from "./offer-history-table";

export type OfferProgress = {
  id: string;
  offer_id: string;
  offer_details: {
    name: string;
    image_url: string;
    network: string;
    events: { id: number; name: string; payout: number }[];
    points: number;
  };
  status: 'in-progress' | 'completed';
  started_at: string;
  completed_event_ids: string[];
}

export default function HistoryPage() {
  const [inProgressOffers, setInProgressOffers] = useState<OfferProgress[]>([]);
  const [completedOffers, setCompletedOffers] = useState<OfferProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOfferProgress = async () => {
      setIsLoading(true);
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_offer_progress')
          .select('*')
          .eq('user_id', user.id)
          .order('started_at', { ascending: false });

        if (error) throw error;

        if (data) {
          setInProgressOffers(data.filter(o => o.status === 'in-progress'));
          setCompletedOffers(data.filter(o => o.status === 'completed'));
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'History Unreadable',
          description: "We couldn't read your adventure log. Please try refreshing the page."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfferProgress();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <History className="h-8 w-8 text-primary" />
            Offers Log
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your offer progress and completed rewards
          </p>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="h-64 flex items-center justify-center">
              <WavingMascotLoader text="Loading Your History..." />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="in-progress" className="w-full">
          <TabsList className="bg-card/50 border border-border/50 p-1 mb-6">
            <TabsTrigger value="in-progress" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Clock className="mr-2 h-4 w-4" />
              In Progress
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                {inProgressOffers.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <CheckCircle className="mr-2 h-4 w-4" />
              Completed
              <span className="ml-2 text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-semibold">
                {completedOffers.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="in-progress" className="mt-0">
            <OfferHistoryTable offers={inProgressOffers} emptyState={<QuestMap />} />
          </TabsContent>
          <TabsContent value="completed" className="mt-0">
            <OfferHistoryTable offers={completedOffers} emptyState={<QuestMap />} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
