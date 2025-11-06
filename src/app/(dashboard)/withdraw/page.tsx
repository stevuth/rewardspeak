
'use client';

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { withdrawalHistory, type Withdrawal } from "@/lib/mock-data";
import {
  PaypalLogo,
  UsdtLogo,
} from "@/components/illustrations/crypto-logos";
import { CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { WithdrawalCard } from "@/components/withdrawal-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { processWithdrawalRequest } from "@/app/actions";

const StatusBadge = ({ status }: { status: Withdrawal["status"] }) => {
  if (status === "Completed") {
    return (
      <Badge className="bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30">
        <CheckCircle className="mr-1 h-3 w-3" />
        Completed
      </Badge>
    );
  }
  if (status === "Pending") {
    return (
      <Badge variant="outline" className="text-foreground border-border">
        <Clock className="mr-1 h-3 w-3" />
        Pending
      </Badge>
    );
  }
  if (status === "Failed") {
    return (
      <Badge variant="destructive">
        <XCircle className="mr-1 h-3 w-3" />
        Failed
      </Badge>
    );
  }
  return <Badge variant="secondary">{status}</Badge>;
};

const withdrawalOptions = {
    paypal: [10, 15, 20, 25, 30, 50],
    usdt: [10, 15, 20, 25, 30, 50],
}

type WithdrawalMethod = 'paypal' | 'usdt';

type SelectedWithdrawal = {
    method: WithdrawalMethod;
    amount: number;
}

export default function CashOutCabinPage() {
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<SelectedWithdrawal | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWithdrawClick = (method: WithdrawalMethod, amount: number) => {
    setSelectedWithdrawal({ method, amount });
  };
  
  const handleCloseModal = () => {
    if (isSubmitting) return;
    setSelectedWithdrawal(null);
    setWalletAddress("");
  };

  const handleSubmitWithdrawal = async () => {
    if (!walletAddress) {
        toast({
            variant: "destructive",
            title: "Wallet address required",
            description: `Please enter your ${selectedWithdrawal?.method === 'paypal' ? 'PayPal email' : 'USDT wallet address'}.`
        });
        return;
    }
    if (!selectedWithdrawal) return;

    setIsSubmitting(true);
    
    const result = await processWithdrawalRequest({
        amount: selectedWithdrawal.amount,
        method: selectedWithdrawal.method,
        walletAddress: walletAddress,
    });

    if (result.success) {
        toast({
            title: "Withdrawal Submitted!",
            description: `Your request to withdraw $${selectedWithdrawal.amount} has been received.`
        });
    } else {
        toast({
            variant: "destructive",
            title: "Withdrawal Failed",
            description: result.error || "An unknown error occurred."
        });
    }
    
    setIsSubmitting(false);
    handleCloseModal();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Cash-Out Cabin"
        description="Withdraw your earnings. 1,000 Points = $1.00 USD."
      />

      <Dialog open={!!selectedWithdrawal} onOpenChange={handleCloseModal}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
            <DialogDescription>
                You are about to withdraw <span className="font-bold text-primary">${selectedWithdrawal?.amount}</span> via <span className="font-bold text-primary capitalize">{selectedWithdrawal?.method}</span>.
            </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="wallet-address">
                        {selectedWithdrawal?.method === 'paypal' ? 'PayPal Email' : 'USDT (TRC20) Wallet Address'}
                    </Label>
                    <Input 
                        id="wallet-address"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        placeholder={selectedWithdrawal?.method === 'paypal' ? 'your-email@example.com' : 'T...'}
                        disabled={isSubmitting}
                    />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={handleCloseModal} disabled={isSubmitting}>Cancel</Button>
                <Button onClick={handleSubmitWithdrawal} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <section>
        <div className="flex items-center gap-4 mb-4">
          <PaypalLogo className="w-8 h-8" />
          <h2 className="text-2xl font-bold font-headline">PayPal</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {withdrawalOptions.paypal.map(amount => (
              <WithdrawalCard
                key={`paypal-${amount}`}
                amount={amount}
                points={amount * 1000}
                onClick={() => handleWithdrawClick('paypal', amount)}
                method="paypal"
              />
          ))}
        </div>
      </section>

      <section>
         <div className="flex items-center gap-4 mb-4">
          <UsdtLogo className="w-8 h-8" />
          <h2 className="text-2xl font-bold font-headline">USDT (Tether)</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {withdrawalOptions.usdt.map(amount => (
              <WithdrawalCard
                key={`usdt-${amount}`}
                amount={amount}
                points={amount * 1000}
                onClick={() => handleWithdrawClick('usdt', amount)}
                method="usdt"
              />
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>A log of your recent cash-out requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawalHistory.length > 0 ? (
                withdrawalHistory.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>{withdrawal.date}</TableCell>
                    <TableCell className="font-medium">{withdrawal.method}</TableCell>
                    <TableCell>
                      <StatusBadge status={withdrawal.status} />
                    </TableCell>
                    <TableCell className="text-right font-bold text-secondary">
                      ${(withdrawal.amount / 1000).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No withdrawal history yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
