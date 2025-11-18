
'use client';

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PaypalLogo,
  UsdtLogo,
} from "@/components/illustrations/crypto-logos";
import { CheckCircle, Clock, XCircle, Wallet, AtSign, Gift } from "lucide-react";
import { WithdrawalCard } from "@/components/withdrawal-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { processWithdrawalRequest } from "@/app/actions";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { WithdrawalSuccessModal } from "@/components/withdrawal-success-modal";
import { WavingMascotLoader } from "@/components/waving-mascot-loader";
import { EmptyTreasureChest } from "@/components/illustrations/empty-treasure-chest";
import { cn } from "@/lib/utils";

export const runtime = 'edge';

type Withdrawal = {
  id: string;
  method: string;
  amount_usd: number;
  created_at: string;
  status: "completed" | "pending" | "rejected";
};

const StatusBadge = ({ status }: { status: Withdrawal["status"] }) => {
  const baseClasses = "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold";
  
  if (status === "completed") {
    return (
      <div className={cn(baseClasses, "bg-secondary/10 text-secondary border border-secondary/20")}>
        <CheckCircle className="h-3 w-3" />
        Completed
      </div>
    );
  }
  if (status === "pending") {
    return (
      <div className={cn(baseClasses, "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20")}>
        <Clock className="h-3 w-3" />
        Pending
      </div>
    );
  }
  if (status === "rejected") {
    return (
      <div className={cn(baseClasses, "bg-destructive/10 text-destructive border border-destructive/20")}>
        <XCircle className="h-3 w-3" />
        Rejected
      </div>
    );
  }
  return (
    <div className={cn(baseClasses, "bg-muted text-muted-foreground")}>
      {status}
    </div>
  );
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

const HistoryItem = ({ withdrawal }: { withdrawal: Withdrawal }) => {
  const Icon = withdrawal.method === 'paypal' ? PaypalLogo : UsdtLogo;
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/50 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-muted rounded-full">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="font-semibold capitalize">{withdrawal.method} Withdrawal</p>
          <p className="text-xs text-muted-foreground">{new Date(withdrawal.created_at).toLocaleString()}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-secondary text-lg">${withdrawal.amount_usd.toFixed(2)}</p>
        <StatusBadge status={withdrawal.status} />
      </div>
    </div>
  )
}

export default function CashOutCabinPage() {
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<SelectedWithdrawal | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<Withdrawal[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successfulWithdrawal, setSuccessfulWithdrawal] = useState<SelectedWithdrawal | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      const supabase = createSupabaseBrowserClient();
      try {
        const { data, error } = await supabase
            .from('withdrawal_requests')
            .select('id, created_at, method, amount_usd, status')
            .order('created_at', { ascending: false });

        if (error) throw error;
        setHistory(data as Withdrawal[]);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Can't Load History",
          description: "There was a problem loading your withdrawal history. Please refresh.",
        });
      } finally {
        setIsLoadingHistory(false);
      }
    }
    fetchHistory();
  }, [toast]);

  const handleWithdrawClick = (method: WithdrawalMethod, amount: number) => {
    setSelectedWithdrawal({ method, amount });
  };
  
  const handleCloseModal = () => {
    if (isSubmitting) return;
    setSelectedWithdrawal(null);
    setWalletAddress("");
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessfulWithdrawal(null);
  }

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
        setSuccessfulWithdrawal(selectedWithdrawal);
        setShowSuccessModal(true);
        // Add the new request to the top of the history list for immediate feedback
        const newRequest: Withdrawal = {
            id: `temp-${Date.now()}`,
            created_at: new Date().toISOString(),
            amount_usd: selectedWithdrawal.amount,
            method: selectedWithdrawal.method,
            status: 'pending',
        };
        setHistory(prev => [newRequest, ...prev]);
        handleCloseModal();
    } else {
        toast({
            variant: "destructive",
            title: "Withdrawal Failed",
            description: result.error || "An unknown error occurred."
        });
    }
    
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        description="Withdraw your earnings. 1,000 Points = $1.00 USD."
      />

      <WithdrawalSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        amount={successfulWithdrawal?.amount || 0}
        method={successfulWithdrawal?.method || ''}
      />

      <Dialog open={!!selectedWithdrawal} onOpenChange={(isOpen) => !isOpen && handleCloseModal()}>
        <DialogContent
          className="w-full max-w-md p-0 bg-transparent border-0 shadow-none outline-none"
          hideCloseButton
        >
          <DialogTitle className="sr-only">Confirm Withdrawal</DialogTitle>
          <div className="relative">
            <svg
              viewBox="0 0 400 420"
              className="w-full h-auto drop-shadow-2xl"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="modal-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--card))" />
                  <stop offset="100%" stopColor="hsl(var(--background))" />
                </linearGradient>
              </defs>
              <path
                d="M20 0 H380 C391.046 0 400 8.95431 400 20 V400 C400 411.046 391.046 420 380 420 H20 C8.95431 420 0 411.046 0 400 V20 C0 8.95431 8.95431 0 20 0 Z"
                fill="url(#modal-bg)"
                stroke="hsl(var(--primary) / 0.2)"
                strokeWidth="1"
              />
            </svg>
            <div className="absolute inset-0 p-8 flex flex-col">
              <button
                onClick={handleCloseModal}
                className="absolute right-4 top-4 rounded-md px-2 py-1 bg-black/20 ring-1 ring-primary/50 shadow-sm ring-offset-background transition-all hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground font-semibold text-[#39FF14] hover:text-[#8A2BE2] hover:-translate-y-0.5 active:scale-95 z-10"
              >
                <span className="text-xs uppercase tracking-wider">Close</span>
              </button>
              
              <div className="text-center">
                 <div className="p-4 bg-primary/10 rounded-full w-fit mb-4 mx-auto">
                    {selectedWithdrawal?.method === 'paypal' ? <PaypalLogo className="h-8 w-8" /> : <UsdtLogo className="h-8 w-8" />}
                </div>
                <h2 className="font-headline text-2xl font-bold">Confirm Withdrawal</h2>
                <p className="text-muted-foreground mt-2">
                    You are cashing out <span className="font-bold text-secondary">${selectedWithdrawal?.amount}</span> via <span className="font-bold text-secondary capitalize">{selectedWithdrawal?.method}</span>.
                </p>
              </div>

              <div className="space-y-4 py-6 flex-grow">
                  <div className="space-y-2">
                      <Label htmlFor="wallet-address" className="text-muted-foreground">
                          {selectedWithdrawal?.method === 'paypal' ? 'Your PayPal Email' : 'Your USDT (TRC20) Wallet Address'}
                      </Label>
                      <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              {selectedWithdrawal?.method === 'paypal' ? <AtSign className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
                          </div>
                          <Input 
                              id="wallet-address"
                              value={walletAddress}
                              onChange={(e) => setWalletAddress(e.target.value)}
                              placeholder={selectedWithdrawal?.method === 'paypal' ? 'your-email@example.com' : 'T...'}
                              disabled={isSubmitting}
                              className="pl-10"
                          />
                      </div>
                  </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-auto">
                <Button variant="outline" onClick={handleCloseModal} disabled={isSubmitting}>Cancel</Button>
                <Button onClick={handleSubmitWithdrawal} disabled={isSubmitting} className="w-36">
                    {isSubmitting ? (
                        <WavingMascotLoader messages={["Submitting..."]} />
                    ) : (
                        'Submit Request'
                    )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <section>
        <div className="flex items-center gap-4 mb-4">
          <PaypalLogo className="w-8 h-8" />
          <h2 className="text-2xl font-bold font-headline">PayPal</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
          <PageHeader title="Withdrawal History" description="A log of your recent cash-out requests." />
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {isLoadingHistory ? (
             <div className="h-24 flex items-center justify-center">
                <WavingMascotLoader text="Loading History..." />
             </div>
          ) : history.length > 0 ? (
            history.map((withdrawal) => (
              <HistoryItem key={withdrawal.id} withdrawal={withdrawal} />
            ))
          ) : (
            <EmptyTreasureChest />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
