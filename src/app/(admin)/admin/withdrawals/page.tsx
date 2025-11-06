
'use client';

import { useState, useEffect, useCallback, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import { ChevronLeft, ChevronRight, Loader2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { getWithdrawalRequests, updateWithdrawalRequestStatus } from "@/app/actions";
import { cn } from "@/lib/utils";

export type WithdrawalRequest = {
  id: string;
  created_at: string;
  user_id: string;
  email: string;
  amount_usd: number;
  method: string;
  wallet_address: string;
  status: 'pending' | 'completed' | 'rejected';
};

export default function WithdrawalRequestsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const currentPage = Number(searchParams.get('page')) || 1;
  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const { requests: fetchedRequests, count: totalCount } = await getWithdrawalRequests(currentPage, ITEMS_PER_PAGE);
      setRequests(fetchedRequests || []);
      setCount(totalCount || 0);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch withdrawal requests.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, toast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleStatusUpdate = (id: string, status: 'completed' | 'rejected') => {
    startTransition(async () => {
      const result = await updateWithdrawalRequestStatus(id, status);
      if (result.success) {
        toast({
          title: "Status Updated",
          description: `Request has been marked as ${status}.`
        });
        fetchRequests(); // Refresh the data
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: result.error || "An unknown error occurred."
        })
      }
    });
  };

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };
  
  const getStatusBadge = (status: WithdrawalRequest['status']) => {
    switch (status) {
        case 'pending':
            return <Badge variant="secondary">Pending</Badge>;
        case 'completed':
            return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
        case 'rejected':
            return <Badge variant="destructive">Rejected</Badge>;
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Withdrawal Requests"
        description={`Manage and approve user withdrawal requests. Page ${currentPage} of ${totalPages}.`}
      />

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User Email</TableHead>
                <TableHead>Amount (USD)</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Wallet Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin"/>
                  </TableCell>
                </TableRow>
              ) : requests.length > 0 ? (
                requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      {new Date(req.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">{req.email}</TableCell>
                    <TableCell className="font-bold">${req.amount_usd?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{req.method}</Badge>
                    </TableCell>
                    <TableCell className="max-w-sm truncate text-xs text-muted-foreground">
                        {req.wallet_address}
                    </TableCell>
                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700" 
                          disabled={isPending || req.status !== 'pending'}
                          onClick={() => handleStatusUpdate(req.id, 'completed')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          disabled={isPending || req.status !== 'pending'}
                          onClick={() => handleStatusUpdate(req.id, 'rejected')}
                        >
                           <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No withdrawal requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
            <div className="flex w-full justify-between items-center text-sm text-muted-foreground">
                <div>
                    Showing {requests.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, count)} of {count} requests
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm" disabled={currentPage <= 1}>
                        <Link href={createPageURL(currentPage - 1)}>
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" disabled={currentPage >= totalPages}>
                         <Link href={createPageURL(currentPage + 1)}>
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </Button>
                </div>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
