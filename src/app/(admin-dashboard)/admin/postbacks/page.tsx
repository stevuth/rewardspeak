
'use client';

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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
import Link from "next/link";
import { ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { WavingMascotLoader } from "@/components/waving-mascot-loader";
import { Input } from "@/components/ui/input";

type Transaction = {
  id: number;
  created_at: string;
  txn_id: string;
  offer_id: string;
  offer_name: string;
  user_email: string;
  amount_usd: number;
  payout_usd: number;
  postback_url: string;
  rewarded_txn_id: string | null;
  event_id: string | null;
  event_name: string | null;
};

export default function PostbacksPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const currentPage = Number(searchParams.get('page')) || 1;
  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  const postbackUrl = "https://rewardspeak.com/api/postback";

  const fetchTransactions = useCallback(async () => {
    // Prevent fetching if we know the page is invalid from a previous load
    if (totalPages > 0 && currentPage > totalPages) {
        setIsLoading(false);
        setTransactions([]);
        return;
    }
    
    setIsLoading(true);
    
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('limit', String(ITEMS_PER_PAGE));

    try {
      const response = await fetch(`/api/get-postbacks-paginated?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch transactions");
      }
      const { transactions: fetchedTransactions, count: totalCount } = await response.json();
      setTransactions(fetchedTransactions);
      setCount(totalCount);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Could not fetch postback history.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, toast, totalPages]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(postbackUrl);
    toast({
      title: "Copied to clipboard!",
      description: "Postback URL is ready to be used.",
    });
  };

  return (
    <div className="space-y-8">
        <PageHeader
          title="Postback History"
          description={`A log of all successful offer completions. Page ${currentPage} of ${totalPages || 1}.`}
        />
      
      <Card>
        <CardHeader>
          <CardTitle>Your Postback URL</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            Use this URL to configure postbacks with your offer partners. Append partner-specific parameters as needed.
          </p>
          <div className="relative flex items-center">
            <Input
              id="postback-url"
              type="text"
              value={postbackUrl}
              readOnly
              className="pr-12 bg-muted border-dashed font-mono"
            />
            <Button variant="ghost" size="icon" className="absolute right-1" onClick={handleCopy}>
              <Copy className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table className="min-w-[1200px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Date</TableHead>
                  <TableHead className="w-[200px]">User Email</TableHead>
                  <TableHead>Offer Name</TableHead>
                  <TableHead>Event Name</TableHead>
                  <TableHead className="w-[120px]">Amount (USD)</TableHead>
                  <TableHead className="w-[120px]">Payout (USD)</TableHead>
                  <TableHead>Txn ID</TableHead>
                  <TableHead>Event ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-64">
                      <WavingMascotLoader text="Loading Postbacks..." />
                    </TableCell>
                  </TableRow>
                ) : transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        {new Date(tx.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium max-w-xs truncate">{tx.user_email}</TableCell>
                      <TableCell className="max-w-xs truncate">{tx.offer_name}</TableCell>
                      <TableCell>
                          <Badge variant="outline" className="font-mono">{tx.event_name || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-muted-foreground">${(tx.amount_usd || 0).toFixed(2)}</TableCell>
                      <TableCell className="font-semibold text-secondary">${(tx.payout_usd || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">{tx.txn_id || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell>
                          <Badge variant="secondary" className="font-mono">{tx.event_id || 'N/A'}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-24">
                      No postbacks recorded yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
            <div className="flex w-full justify-between items-center text-sm text-muted-foreground">
                <div>
                    Showing {transactions.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, count)} of {count} transactions
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
