
'use client';

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
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
      
      const { data, error } = await supabase
        .from('user_offer_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch your offer history.' });
      } else if (data) {
        setInProgressOffers(data.filter(o => o.status === 'in-progress'));
        setCompletedOffers(data.filter(o => o.status === 'completed'));
      }
      setIsLoading(false);
    };

    fetchOfferProgress();
  }, [toast]);

  return (
    <div className="space-y-8">
      <PageHeader
        description="Review your completed, pending, and rejected offers."
        icon={History}
      />
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <WavingMascotLoader text="Loading Your History..." />
            </div>
          ) : (
            <Tabs defaultValue="in-progress" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:w-fit md:inline-flex mb-4">
                <TabsTrigger value="in-progress">
                    <Clock className="mr-2 h-4 w-4" />
                    In Progress ({inProgressOffers.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Completed ({completedOffers.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="in-progress">
                <OfferHistoryTable offers={inProgressOffers} emptyState={<QuestMap />} />
              </TabsContent>
              <TabsContent value="completed">
                <OfferHistoryTable offers={completedOffers} emptyState={<QuestMap />} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
