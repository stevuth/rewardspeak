

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import { withdrawalMethods, withdrawalHistory, type Withdrawal } from "@/lib/mock-data";
import {
  PaypalLogo,
  LitecoinLogo,
  UsdCoinLogo,
  BinanceCoinLogo,
  BitcoinLogo,
  EthereumLogo,
} from "@/components/illustrations/crypto-logos";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Cash-Out Cabin",
  description: "Withdraw points to cash, crypto, or gift cards.",
};

const iconMap: Record<string, React.ElementType> = {
  PayPal: PaypalLogo,
  Litecoin: LitecoinLogo,
  "USD Coin": UsdCoinLogo,
  "Binance Coin": BinanceCoinLogo,
  Bitcoin: BitcoinLogo,
  Ethereum: EthereumLogo,
};

const colorMap: Record<string, string> = {
    "PayPal": "bg-[#003087]",
    "Litecoin": "bg-muted-foreground/50",
    "USD Coin": "bg-[#2775ca]",
    "Binance Coin": "bg-[#f0b90b]",
    "Bitcoin": "bg-[#f7931a]",
    "Ethereum": "bg-[#627eea]",
}


const WithdrawalCard = ({ method }: { method: typeof withdrawalMethods[0] }) => {
  const Icon = iconMap[method.name];
  const bgColor = colorMap[method.name] || "bg-card";

  return (
    <div className="relative group">
        <Card className={cn("overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl", bgColor)}>
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[150px]">
            {Icon && <Icon className="w-16 h-16 text-white" />}
        </CardContent>
        </Card>
         <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
            {method.name}
        </div>
        {method.name === "Litecoin" && (
             <div className="absolute top-0 right-0 w-24 h-24">
                <div className="absolute transform rotate-45 bg-green-600 text-center text-white font-semibold py-1 right-[-40px] top-[20px] w-[120px] shadow-lg">
                    Recommended
                </div>
            </div>
        )}
    </div>
  );
};

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
      <Badge variant="outline" className="text-yellow-400 border-yellow-600/30">
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


export default function CashOutCabinPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Cash Payments"
        description={`${withdrawalMethods.length} options available`}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {withdrawalMethods.map((method) => (
          <WithdrawalCard key={method.name} method={method} />
        ))}
      </div>
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
                    <TableCell className="text-right font-bold text-primary">
                      ${(withdrawal.amount / 100).toFixed(2)}
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
