
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { withdrawalMethods, type WithdrawalMethod } from "@/lib/mock-data";
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


const WithdrawalCard = ({ method }: { method: WithdrawalMethod }) => {
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
    </div>
  );
}
