
"use client";

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
    <div
      onClick={onClick}
      className="group relative cursor-pointer aspect-[4/3] w-full transition-transform duration-300 ease-in-out hover:-translate-y-1.5"
    >
      <svg
        viewBox="0 0 160 120"
        className="w-full h-full drop-shadow-lg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="paypal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#003087" />
            <stop offset="100%" stopColor="#009cde" />
          </linearGradient>
          <linearGradient id="usdt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
           <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--card))" />
            <stop offset="100%" stopColor="hsl(var(--muted))" />
          </linearGradient>
        </defs>

        {/* Base shape */}
        <path
          d="M10 0 H150 C155.523 0 160 4.47715 160 10 V110 C160 115.523 155.523 120 150 120 H10 C4.47715 120 0 115.523 0 110 V10 C0 4.47715 4.47715 0 10 0 Z"
          fill="url(#bg-grad)"
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />
        
        {/* Accent shape */}
        <path
          d="M0 10C0 4.47715 4.47715 0 10 0H80L40 120H10C4.47715 120 0 115.523 0 110V10Z"
          fill={isPayPal ? "url(#paypal-grad)" : "url(#usdt-grad)"}
          className="opacity-80 group-hover:opacity-100 transition-opacity"
        />

        {/* Content */}
        <foreignObject x="0" y="0" width="160" height="120" className="pointer-events-none">
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                 <div className="flex items-start">
                    <span className="text-2xl font-semibold text-muted-foreground mr-1 mt-1">$</span>
                    <span className="text-5xl font-extrabold text-foreground tracking-tight">{amount}</span>
                </div>
                <p className="text-sm font-bold text-secondary -mt-1">
                  {points.toLocaleString()} Points
                </p>
                 <div className="mt-auto flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Withdraw <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </foreignObject>
      </svg>
    </div>
  );
}
