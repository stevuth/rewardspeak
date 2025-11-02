'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/utils/supabase/client';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { Metadata } from 'next';

// Note: Metadata is not used in client components, but good for reference
// export const metadata: Metadata = {
//   title: 'Surveys',
//   description: 'Complete surveys to earn points.',
// };

export default function SurveysPage() {
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const constructUrl = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      const apiKey = process.env.NEXT_PUBLIC_THEOREMREACH_API_KEY;
      
      if (user && apiKey) {
        // The user's Supabase ID is a good unique identifier.
        const userId = user.id;
        // A simple unique transaction ID can be generated for each session
        const transactionId = `${userId}-${Date.now()}`;
        
        const url = `https://theoremreach.com/respondent_entry/direct?api_key=${apiKey}&user_id=${userId}&transaction_id=${transactionId}`;
        setIframeSrc(url);
      } else {
        console.error("User not logged in or API key not found.");
      }
      setIsLoading(false);
    };

    constructUrl();
  }, []);

  return (
    <div className="space-y-8 h-full flex flex-col">
      <PageHeader
        title="Complete Surveys"
        description="Share your opinion and earn rewards."
      />
      <Card className="flex-grow">
        <CardContent className="p-0 h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="ml-4">Loading Surveys...</p>
            </div>
          ) : iframeSrc ? (
            <iframe
              src={iframeSrc}
              className="w-full h-full border-0"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Could not load surveys. Please make sure you are logged in.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
