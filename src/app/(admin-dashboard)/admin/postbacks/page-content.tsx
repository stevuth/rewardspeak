
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
import { ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { WavingMascotLoader } from "@/components/waving-mascot-loader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Transaction = {
    id: string;
    created_at: string;
    txn_id: string;
    offer_id: string;
    offer_name: string;
    user_id: string;
    user_email: string;
    amount_usd: number;
    payout_usd: number;
    postback_url: string;
    rewarded_txn_id: string | null;
    event_id: string | null;
    event_name: string | null;
};

export default function PostbacksPageContent() {
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

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        const params = new URLSearchParams();
        params.set('page', String(currentPage));
        params.set('limit', String(ITEMS_PER_PAGE));
        
        try {
            const response = await fetch(`/api/get-postbacks-paginated?${params.toString()}`);
            if (!response.ok) {
                throw new Error("Failed to fetch postbacks");
            }
            const { transactions: fetchedTransactions, count: totalCount } = await response.json();
            setTransactions(fetchedTransactions);
            setCount(totalCount);
        } catch (error) {
            console.error("Error fetching postbacks:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not fetch postback history.",
            });
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, toast]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };
    
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: "The text has been copied to your clipboard.",
        });
    }

    const renderTooltip = (content: string) => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="truncate block max-w-[150px]">{content}</span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    return (
        <div className="space-y-8">
            <PageHeader
                title="Postback History"
                description={`A log of all incoming offer completions. Page ${currentPage} of ${totalPages}.`}
            />

            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Offer Name</TableHead>
                                <TableHead>Reward</TableHead>
                                <TableHead>Event</TableHead>
                                <TableHead>Txn ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {isLoading ? (
                                <TableRow>
                                <TableCell colSpan={6} className="text-center h-64">
                                    <WavingMascotLoader text="Loading Postbacks..." />
                                </TableCell>
                                </TableRow>
                            ) : transactions.length > 0 ? (
                                transactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
                                        <TableCell>{renderTooltip(tx.user_email || tx.user_id)}</TableCell>
                                        <TableCell>{renderTooltip(tx.offer_name)}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">${tx.amount_usd.toFixed(4)}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {tx.event_name ? (
                                                <Badge variant="outline">{tx.event_name}</Badge>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {renderTooltip(tx.txn_id)}
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(tx.txn_id)}>
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                             ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">
                                        No postbacks recorded yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                 <CardFooter>
                    <div className="flex w-full justify-between items-center text-sm text-muted-foreground">
                        <div>
                            Showing {transactions.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, count)} of {count} postbacks
                        </div>
                        <div className="flex items-center gap-2">
                            <Button asChild variant="outline" size="sm" disabled={currentPage <= 1}>
                                <a href={createPageURL(currentPage - 1)}>
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </a>
                            </Button>
                            <Button asChild variant="outline" size="sm" disabled={currentPage >= totalPages}>
                                <a href={createPageURL(currentPage + 1)}>
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
