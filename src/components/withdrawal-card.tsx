
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WithdrawalCardProps = {
  amount: number;
  points: number;
  onClick: () => void;
  method: 'paypal' | 'usdt';
};

export function WithdrawalCard({ amount, points, onClick, method }: WithdrawalCardProps) {
  const isPayPal = method === 'paypal';

  return (
    <Card 
      onClick={onClick}
      className={cn(
        "text-center p-4 transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1",
        isPayPal
          ? "bg-[#003087] border-[#009cde] text-white hover:bg-[#00296b] hover:shadow-[0_0_15px_rgba(0,156,222,0.5)]"
          : "hover:bg-primary/10 hover:border-primary"
      )}
    >
      <CardContent className="p-2">
        <p className={cn("text-2xl font-bold", isPayPal ? "text-white" : "text-primary")}>
          ${amount}
        </p>
        <p className={cn("text-sm", isPayPal ? "text-gray-300" : "text-muted-foreground")}>
          {points.toLocaleString()} Points
        </p>
        <Button 
          variant="link" 
          className={cn("mt-2 text-xs h-auto p-0", isPayPal ? "text-[#009cde] hover:text-white" : "text-primary")}
        >
          Withdraw
        </Button>
      </CardContent>
    </Card>
  );
}
