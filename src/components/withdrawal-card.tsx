
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type WithdrawalCardProps = {
  amount: number;
  points: number;
  onClick: () => void;
};

export function WithdrawalCard({ amount, points, onClick }: WithdrawalCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="text-center p-4 transition-all duration-300 ease-in-out cursor-pointer hover:bg-primary/10 hover:border-primary hover:-translate-y-1"
    >
      <CardContent className="p-2">
        <p className="text-2xl font-bold text-primary">${amount}</p>
        <p className="text-sm text-muted-foreground">{points.toLocaleString()} Points</p>
        <Button variant="link" className="mt-2 text-xs h-auto p-0">Withdraw</Button>
      </CardContent>
    </Card>
  );
}
