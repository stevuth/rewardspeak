
'use client';

import { useState, useEffect, useCallback, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ChevronLeft, ChevronRight, Loader2, Check, X, Search, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { getWithdrawalRequests, updateWithdrawalRequestStatus, updateBulkWithdrawalRequestStatus, getAllWithdrawalRequestsForCSV } from "@/app/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { WavingMascotLoader } from "@/components/waving-mascot-loader";


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
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const currentPage = Number(searchParams.get('page')) || 1;
  const emailFilter = searchParams.get('email') || '';
  const methodFilter = searchParams.get('method') || '';
  const statusFilter = searchParams.get('status') || '';
  
  const [emailInput, setEmailInput] = useState(emailFilter);
  const [methodInput, setMethodInput] = useState(methodFilter);
  const [statusInput, setStatusInput] = useState(statusFilter);

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const { requests: fetchedRequests, count: totalCount } = await getWithdrawalRequests({
        page: currentPage, 
        limit: ITEMS_PER_PAGE,
        email: emailFilter,
        method: methodFilter,
        status: statusFilter,
      });
      setRequests(fetchedRequests || []);
      setCount(totalCount || 0);
      setSelectedRows([]); // Clear selection on new data load
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch withdrawal requests.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, emailFilter, methodFilter, statusFilter, toast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    if (emailInput) params.set('email', emailInput); else params.delete('email');
    if (methodInput) params.set('method', methodInput); else params.delete('method');
    if (statusInput) params.set('status', statusInput); else params.delete('status');
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  const handleClearFilters = () => {
    setEmailInput('');
    setMethodInput('');
    setStatusInput('');
    startTransition(() => {
        router.push(pathname);
    });
  };

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

  const handleBulkUpdate = (status: 'completed' | 'rejected') => {
    startTransition(async () => {
        const result = await updateBulkWithdrawalRequestStatus(selectedRows, status);
        if (result.success) {
            toast({
                title: "Bulk Update Successful",
                description: `${result.processed} requests have been marked as ${status}.`
            });
            fetchRequests(); // Refresh the data
        } else {
            toast({
                variant: "destructive",
                title: "Bulk Update Failed",
                description: result.error || `Failed to update ${result.failed} requests.`
            });
        }
    });
  };

  const handleDownloadCSV = async () => {
    setIsDownloading(true);
    toast({ title: "Preparing Download...", description: "Fetching all matching requests." });

    const { requests: allRequests, error } = await getAllWithdrawalRequestsForCSV({
      email: emailFilter,
      method: methodFilter,
      status: statusFilter,
    });

    if (error || !allRequests) {
        toast({ variant: "destructive", title: "Download Failed", description: error || "Could not fetch data for CSV." });
        setIsDownloading(false);
        return;
    }

    // Convert JSON to CSV
    const headers = ["ID", "Date", "User Email", "Amount (USD)", "Method", "Wallet Address", "Status"];
    const csvRows = [
        headers.join(','),
        ...allRequests.map(req => [
            `"${req.id}"`,
            `"${new Date(req.created_at).toLocaleString()}"`,
            `"${req.email}"`,
            req.amount_usd,
            `"${req.method}"`,
            `"${req.wallet_address}"`,
            `"${req.status}"`,
        ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `withdrawal-requests-${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Download Started", description: "Your CSV file is being downloaded." });
    setIsDownloading(false);
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(requests.map(req => req.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Withdrawal Requests"
        description={`Manage and approve user withdrawal requests. Page ${currentPage} of ${totalPages}.`}
      />

       <Card>
        <CardHeader>
            <CardTitle>Filter & Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="email-filter">Filter by Email</Label>
                    <Input 
                        id="email-filter"
                        placeholder="user@example.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="method-filter">Payment Method</Label>
                    <Select value={methodInput} onValueChange={setMethodInput}>
                        <SelectTrigger id="method-filter">
                            <SelectValue placeholder="All Methods" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Methods</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="usdt">USDT</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status-filter">Payment Status</Label>
                    <Select value={statusInput} onValueChange={setStatusInput}>
                        <SelectTrigger id="status-filter">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
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
                <Button onClick={handleDownloadCSV} variant="outline" disabled={isDownloading}>
                    {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4"/>}
                    Download CSV
                </Button>
            </div>
        </CardContent>
       </Card>

       {selectedRows.length > 0 && (
         <Card>
            <CardContent className="pt-6 flex items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">{selectedRows.length} selected</p>
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleBulkUpdate('completed')} disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Check className="mr-2 h-4 w-4" />}
                    Approve Selected
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleBulkUpdate('rejected')} disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <X className="mr-2 h-4 w-4" />}
                    Reject Selected
                </Button>
            </CardContent>
         </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedRows.length === requests.length && requests.length > 0}
                    onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                    aria-label="Select all rows on this page"
                  />
                </TableHead>
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
                  <TableCell colSpan={8} className="text-center h-64">
                    <WavingMascotLoader text="Loading Requests..." />
                  </TableCell>
                </TableRow>
              ) : requests.length > 0 ? (
                requests.map((req) => (
                  <TableRow key={req.id} data-state={selectedRows.includes(req.id) && "selected"}>
                    <TableCell>
                       <Checkbox
                        checked={selectedRows.includes(req.id)}
                        onCheckedChange={(checked) => handleSelectRow(req.id, Boolean(checked))}
                        aria-label={`Select row ${req.id}`}
                      />
                    </TableCell>
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
                  <TableCell colSpan={8} className="text-center h-24">
                    No withdrawal requests found for the current filters.
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
