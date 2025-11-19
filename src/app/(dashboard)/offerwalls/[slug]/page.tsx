
'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/utils/supabase/client';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { WavingMascotLoader } from '@/components/waving-mascot-loader';

interface Offerwall {
    name: string;
    getIframeUrl: (userId: string) => string;
}

const offerwalls: Record<string, Offerwall> = {
    timewall: {
        name: "TimeWall",
        getIframeUrl: (userId) => `https://timewall.io/users/login?oid=eeade03b99a53feb&uid=${userId}`
    },
    theoremreach: {
        name: "TheoremReach",
        getIframeUrl: (userId) => {
            const apiKey = process.env.NEXT_PUBLIC_THEOREMREACH_API_KEY;
            const transactionId = `${userId}-${Date.now()}`;
            return `https://theoremreach.com/respondent_entry/direct?api_key=${apiKey}&user_id=${userId}&transaction_id=${transactionId}`;
        }
    }
};

export default function OfferwallIframePage() {
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const offerwall = slug ? offerwalls[slug] : undefined;

  useEffect(() => {
    const constructUrl = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && offerwall) {
        const userId = user.id;
        const url = offerwall.getIframeUrl(userId);
        setIframeSrc(url);
      } else {
        console.error("User not logged in or offerwall not found.");
      }
      setIsLoading(false);
    };

    if(slug && offerwall) {
        constructUrl();
    } else {
        setIsLoading(false);
    }
  }, [slug, offerwall]);

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-96">
            <WavingMascotLoader text="Loading Offerwall..." />
        </div>
    );
  }

  if (!offerwall) {
      return (
        <div className="space-y-8 h-full flex flex-col items-center justify-center">
            <PageHeader
                title="Offerwall Not Found"
                description="The offerwall you are looking for does not exist."
            />
             <Button onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
        </div>
      )
  }

  return (
    <div className="space-y-8 h-full flex flex-col">
        <div className="flex items-center gap-4">
             <Button variant="outline" size="icon" className="shrink-0" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Go back</span>
            </Button>
            <PageHeader
                title={offerwall.name}
                description="Complete offers to earn rewards."
            />
      </div>
      <Card className="flex-grow">
        <CardContent className="p-0 h-full">
          {iframeSrc ? (
            <iframe
              src={iframeSrc}
              className="w-full h-full border-0"
              style={{height: 'calc(100vh - 200px)'}}
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Could not load offerwall. Please make sure you are logged in.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
