
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

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
        "group relative text-center p-4 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden",
        "bg-card/50 border-border hover:border-primary/50",
        "hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1.5"
      )}
    >
        <div className={cn(
            "absolute inset-0 transition-all duration-500 opacity-0 group-hover:opacity-100",
             isPayPal 
                ? "bg-gradient-to-br from-[#003087]/20 via-transparent to-transparent" 
                : "bg-gradient-to-br from-primary/20 via-transparent to-transparent"
        )} />

      <CardContent className="p-2 relative z-10 flex flex-col items-center justify-center h-full">
        <p className={cn(
            "text-4xl font-extrabold tracking-tight", 
            isPayPal ? "text-white" : "text-foreground"
            )}
        >
          <span className="text-2xl text-muted-foreground">$</span>{amount}
        </p>
        <p className={cn("text-xs font-bold", isPayPal ? "text-blue-300" : "text-secondary")}>
          {points.toLocaleString()} Points
        </p>
        <Button 
            variant="secondary"
            size="sm"
            className="mt-4 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-y-0 translate-y-2"
        >
            Withdraw <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
