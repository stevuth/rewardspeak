'use client';

import { useState, useEffect, useCallback, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ChevronLeft, ChevronRight, RefreshCw, Search, X, Percent, ListTodo, List, Bot, Clock } from "lucide-react";
import { OfferDetailsRow } from "./offer-details-row";
import { getOfferPayoutPercentage, updateOfferPayoutPercentage, getOfferDisplayLimit, updateOfferDisplayLimit, getCronLogs } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { WavingMascotLoader } from "@/components/waving-mascot-loader";
import { clientGetAllOffers } from "@/lib/notik-api";
import { Badge } from "@/components/ui/badge";

type Offer = {
  offer_id: string;
  name: string;
  description: string;
  click_url: string;
  image_url: string;
  network: string;
  payout: number;
  countries: string[];
  platforms: string[];
  devices: string[];
  categories: string[];
  events: { id: number; name: string; payout: number }[];
  is_disabled: boolean;
  created_at: string;
};

type CronLog = {
    id: string;
    created_at: string;
    status: 'success' | 'failure';
    log_message: string;
    offers_synced_count: number;
}

export default function ManageOffersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLog, setSyncLog] = useState<string | null>(null);
  const [cronLogs, setCronLogs] = useState<CronLog[]>([]);
  const [isLoadingCronLogs, setIsLoadingCronLogs] = useState(true);

  const { toast } = useToast();
  
  const [isPending, startTransition] = useTransition();

  const currentPage = Number(searchParams.get('page')) || 1;
  const offerIdFilter = searchParams.get('offerId') || '';
  const offerNameFilter = searchParams.get('offerName') || '';
  const undefinedDescriptionFilter = searchParams.get('undefinedDescription') === 'true';

  const [idInput, setIdInput] = useState(offerIdFilter);
  const [nameInput, setNameInput] = useState(offerNameFilter);
  const [undefinedDescInput, setUndefinedDescInput] = useState(undefinedDescriptionFilter);

  const [payoutPercentage, setPayoutPercentage] = useState<number | string>('');
  const [isSavingPercentage, setIsSavingPercentage] = useState(false);

  const [offerDisplayLimit, setOfferDisplayLimit] = useState<number | string>('');
  const [isSavingLimit, setIsSavingLimit] = useState(false);

  const OFFERS_PER_PAGE = 20;
  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  const fetchCronLogs = useCallback(async () => {
    setIsLoadingCronLogs(true);
    const { data, error } = await getCronLogs();
    if (error) {
        toast({
            variant: "destructive",
            title: "Error fetching cron logs",
            description: "Could not fetch automated sync history.",
        });
        setCronLogs([]);
    } else {
        setCronLogs(data || []);
    }
    setIsLoadingCronLogs(false);
  }, [toast]);

  useEffect(() => {
    async function fetchSettings() {
        const { data: percentageData } = await getOfferPayoutPercentage();
        setPayoutPercentage(percentageData);
        
        const { data: limitData } = await getOfferDisplayLimit();
        setOfferDisplayLimit(limitData);
    }
    fetchSettings();
    fetchCronLogs();
  }, [fetchCronLogs]);

  const fetchOffers = useCallback(async () => {
    setIsLoading(true);
    
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('limit', String(OFFERS_PER_PAGE));
    if (offerIdFilter) params.set('offerId', offerIdFilter);
    if (offerNameFilter) params.set('offerName', offerNameFilter);
    if (undefinedDescriptionFilter) params.set('undefinedDescription', 'true');

    try {
      const response = await fetch(`/api/get-offers-paginated?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch offers");
      }
      const { offers: fetchedOffers, count: totalCount } = await response.json();
      setOffers(fetchedOffers);
      setCount(totalCount);
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch offers.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, offerIdFilter, offerNameFilter, undefinedDescriptionFilter, toast]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);
  
  useEffect(() => {
    setIdInput(offerIdFilter);
    setNameInput(offerNameFilter);
    setUndefinedDescInput(undefinedDescriptionFilter);
  }, [offerIdFilter, offerNameFilter, undefinedDescriptionFilter]);

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1'); // Reset to first page on new filter
    if (idInput) {
        params.set('offerId', idInput);
    } else {
        params.delete('offerId');
    }
    if (nameInput) {
        params.set('offerName', nameInput);
    } else {
        params.delete('offerName');
    }
    if (undefinedDescInput) {
        params.set('undefinedDescription', 'true');
    } else {
        params.delete('undefinedDescription');
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleClearFilters = () => {
    setIdInput('');
    setNameInput('');
    setUndefinedDescInput(false);
    startTransition(() => {
        router.push(pathname);
    });
  };

  const handleSyncOffers = async () => {
    setIsSyncing(true);
    let cumulativeLog = "Manual sync process started...\n";
    setSyncLog(cumulativeLog);
    toast({ title: "Syncing offers...", description: "Fetching the latest offers from our partners." });

    const { offers: fetchedOffers, log: fetchLog } = await clientGetAllOffers((newLog) => {
        cumulativeLog += newLog;
        setSyncLog(cumulativeLog);
    });

    cumulativeLog += fetchLog;
    setSyncLog(cumulativeLog);

    if (fetchedOffers.length > 0) {
        cumulativeLog += `Fetched ${fetchedOffers.length} offers. Now saving to database...\n`;
        setSyncLog(cumulativeLog);

        const response = await fetch('/api/sync-offers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ offers: fetchedOffers }),
        });

        const result = await response.json();
        cumulativeLog += result.log || 'No save log returned.\n';
        setSyncLog(cumulativeLog);

        if (response.ok) {
            toast({ title: "Sync complete!", description: "Offers have been updated successfully." });
            await fetchOffers(); // Refetch offers
        } else {
            toast({
                variant: "destructive",
                title: "Sync failed",
                description: result.error || "An unknown error occurred during sync.",
            });
        }
    } else {
        cumulativeLog += "No offers fetched from the partner API.\n";
        setSyncLog(cumulativeLog);
        toast({
            variant: "destructive",
            title: "Sync Incomplete",
            description: "No offers were returned from the partner API.",
        });
    }

    setIsSyncing(false);
  };
  
  const handleSavePercentage = async () => {
    const value = Number(payoutPercentage);
    if (isNaN(value) || value < 0 || value > 100) {
      toast({ variant: 'destructive', title: 'Invalid Percentage', description: 'Please enter a number between 0 and 100.' });
      return;
    }
    
    setIsSavingPercentage(true);
    const result = await updateOfferPayoutPercentage(value);
    if (result.success) {
      toast({ title: 'Success', description: 'Payout percentage updated successfully.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error || 'Failed to update percentage.' });
    }
    setIsSavingPercentage(false);
  };

  const handleSaveLimit = async () => {
    const value = Number(offerDisplayLimit);
    if (isNaN(value) || value <= 0) {
      toast({ variant: 'destructive', title: 'Invalid Limit', description: 'Please enter a positive number.' });
      return;
    }
    
    setIsSavingLimit(true);
    const result = await updateOfferDisplayLimit(value);
    if (result.success) {
      toast({ title: 'Success', description: 'Offer display limit updated successfully.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error || 'Failed to update limit.' });
    }
    setIsSavingLimit(false);
  };

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <PageHeader
          title="Manage Offers"
          description={`Showing page ${currentPage} of ${totalPages}. Total offers: ${count}.`}
        />
        <Button onClick={handleSyncOffers} disabled={isSyncing}>
          {isSyncing ? (
              <div className="w-24 h-5"><WavingMascotLoader messages={["Syncing..."]} /></div>
          ) : (
            <>
              <RefreshCw className={`mr-2 h-4 w-4`} />
              Sync Offers
            </>
          )}
        </Button>
      </div>

       <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Offer Payout Settings</CardTitle>
            <CardDescription>Set the percentage of the actual offer payout to be shown to users. E.g., 60 means users see 60% of the reward.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="max-w-xs space-y-2">
                  <Label htmlFor="payout-percentage">User Payout Percentage</Label>
                  <div className="relative">
                      <Input
                          id="payout-percentage"
                          type="number"
                          min="0"
                          max="100"
                          value={payoutPercentage}
                          onChange={(e) => setPayoutPercentage(e.target.value)}
                          className="pl-8"
                          placeholder="e.g., 60"
                      />
                      <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
              </div>
          </CardContent>
          <CardFooter>
              <Button onClick={handleSavePercentage} disabled={isSavingPercentage}>
                  {isSavingPercentage ? <div className="w-24 h-5"><WavingMascotLoader messages={["Saving..."]}/></div> : 'Save Percentage'}
              </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Offer Display Limit</CardTitle>
            <CardDescription>Set the maximum number of offers to display to users on the "Earn" page. This helps manage performance.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="max-w-xs space-y-2">
                  <Label htmlFor="display-limit">Max Offers to Display</Label>
                  <div className="relative">
                      <Input
                          id="display-limit"
                          type="number"
                          min="1"
                          value={offerDisplayLimit}
                          onChange={(e) => setOfferDisplayLimit(e.target.value)}
                          className="pl-8"
                          placeholder="e.g., 1000"
                      />
                      <ListTodo className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
              </div>
          </CardContent>
          <CardFooter>
              <Button onClick={handleSaveLimit} disabled={isSavingLimit}>
                  {isSavingLimit ? <div className="w-24 h-5"><WavingMascotLoader messages={["Saving..."]}/></div> : 'Save Limit'}
              </Button>
          </CardFooter>
        </Card>
       </div>
      
       <Card>
        <CardHeader>
          <CardTitle>Filter Offers</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <Input 
                    placeholder="Filter by Offer ID..."
                    value={idInput}
                    onChange={(e) => setIdInput(e.target.value)}
                />
                <Input
                    placeholder="Filter by Offer Name..."
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                />
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="undefined-description"
                        checked={undefinedDescInput}
                        onCheckedChange={(checked) => setUndefinedDescInput(Boolean(checked))}
                    />
                    <Label htmlFor="undefined-description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        No/generic description
                    </Label>
                </div>
            </div>
            <div className="flex gap-2">
                <Button onClick={handleFilter} disabled={isPending}>
                    <Search className="mr-2 h-4 w-4"/>
                    {isPending ? 'Filtering...' : 'Filter'}
                </Button>
                 <Button onClick={handleClearFilters} variant="outline" disabled={isPending}>
                    <X className="mr-2 h-4 w-4"/>
                    Clear
                </Button>
            </div>
        </CardContent>
       </Card>

       {syncLog && (
        <Card>
          <CardHeader>
            <CardTitle>Manual Sync Log</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded-md whitespace-pre-wrap">{syncLog}</pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5"/> Automated Sync Setup</CardTitle>
          <CardDescription>
            The system uses a Supabase Edge Function to sync offers automatically. Follow these one-time setup steps in your terminal from the project root directory.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div>
              <h4 className="font-semibold">Step 1: Update the Supabase CLI</h4>
              <p className="text-sm text-muted-foreground mb-2">The CLI in this environment may be outdated. Run this command to get the latest version.</p>
              <pre className="text-xs bg-muted p-2 rounded-md font-mono"><code>npm i -g supabase@latest</code></pre>
            </div>
             <div>
              <h4 className="font-semibold">Step 2: Log in to Supabase</h4>
              <p className="text-sm text-muted-foreground mb-2">This command will open a browser window for you to authorize the CLI. Follow the on-screen instructions.</p>
              <pre className="text-xs bg-muted p-2 rounded-md font-mono"><code>supabase login</code></pre>
            </div>
             <div>
              <h4 className="font-semibold">Step 3: Set API Secrets</h4>
              <p className="text-sm text-muted-foreground mb-2">Run these commands one by one, replacing the placeholder values with your actual Notik API credentials.</p>
              <pre className="text-xs bg-muted p-2 rounded-md font-mono"><code>supabase secrets set NOTIK_API_KEY="your_key_here"<br/>supabase secrets set NOTIK_PUB_ID="your_pub_id_here"<br/>supabase secrets set NOTIK_APP_ID="your_app_id_here"</code></pre>
            </div>
             <div>
              <h4 className="font-semibold">Step 4: Deploy the Edge Function</h4>
              <p className="text-sm text-muted-foreground mb-2">This command uploads your `sync-offers` function to your Supabase project.</p>
              <pre className="text-xs bg-muted p-2 rounded-md font-mono"><code>supabase functions deploy sync-offers</code></pre>
            </div>
             <div>
              <h4 className="font-semibold">Step 5: Schedule the Function</h4>
              <p className="text-sm text-muted-foreground mb-2">In your Supabase dashboard, go to <strong>Database &gt; Edge Functions</strong>, select `sync-offers`, go to the **Schedules** tab, and create a schedule to run every 15 minutes using the cron expression `*/15 * * * *`.</p>
            </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5"/> Automated Sync History</CardTitle>
          <CardDescription>
            A log of the most recent automated syncs performed by the Supabase Edge Function.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">Timestamp</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Offers Synced</TableHead>
                        <TableHead>Log</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoadingCronLogs ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                <WavingMascotLoader text="Loading logs..." />
                            </TableCell>
                        </TableRow>
                    ) : cronLogs.length > 0 ? (
                        cronLogs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="text-muted-foreground flex items-center gap-2">
                                    <Clock className="h-4 w-4"/>
                                    {new Date(log.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={log.status === 'success' ? 'secondary' : 'destructive'}>
                                        {log.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-bold">{log.offers_synced_count}</TableCell>
                                <TableCell>
                                    <pre className="text-xs max-h-24 overflow-y-auto bg-muted/50 p-2 rounded-md whitespace-pre-wrap">{log.log_message}</pre>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                         <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                No automated syncs have been recorded yet. Ensure the Supabase Scheduler is configured correctly.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>Countries</TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    <div className="flex justify-center items-center py-12 h-64">
                       <WavingMascotLoader text="Loading offers..." />
                    </div>
                  </TableCell>
                </TableRow>
              ) : offers.length > 0 ? (
                offers.map((offer) => (
                  <OfferDetailsRow key={offer.offer_id} offer={offer} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    No offers found for the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
            <div className="flex w-full justify-between items-center text-sm text-muted-foreground">
                <div>
                    Showing {offers.length > 0 ? ((currentPage - 1) * OFFERS_PER_PAGE) + 1 : 0} - {Math.min(currentPage * OFFERS_PER_PAGE, count)} of {count} offers
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" disabled={currentPage <= 1}>
                        <Link href={createPageURL(currentPage - 1)}>
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Previous
                        </Link>
                    </Button>
                    <Button asChild variant="outline" disabled={currentPage >= totalPages}>
                         <Link href={createPageURL(currentPage + 1)}>
                            Next
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}

    