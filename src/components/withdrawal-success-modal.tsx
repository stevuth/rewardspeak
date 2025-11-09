
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SuccessIllustration = () => (
    <svg width="128" height="128" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto drop-shadow-lg">
        <defs>
            <linearGradient id="chestGradSuccess" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary) / 0.9)" />
                <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
            </linearGradient>
            <linearGradient id="metalGradSuccess" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--muted))" />
                <stop offset="100%" stopColor="hsl(var(--border))" />
            </linearGradient>
            <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--secondary))" />
                <stop offset="100%" stopColor="hsl(var(--secondary) / 0.7)" />
            </linearGradient>
        </defs>
        
        {/* Chest Body */}
        <path d="M40 130 H216 V210 H40 Z" fill="url(#chestGradSuccess)" />
        <path d="M40 130 L216 130 L221 125 L45 125 Z" fill="hsl(var(--border))" />
        <path d="M216 130 V210 L221 205 V125 Z" fill="hsl(var(--border))" />
        
        {/* Metal Bands */}
        <rect x="30" y="120" width="196" height="15" fill="url(#metalGradSuccess)" />
        <rect x="30" y="205" width="196" height="15" fill="url(#metalGradSuccess)" />
        
        {/* Lid */}
        <path d="M45 125 C 45 80, 80 60, 128 60 C 176 60, 211 80, 211 125 Z" fill="url(#chestGradSuccess)" transform="rotate(-5 128 125)"/>
        <path d="M45 125 C 45 80, 211 80, 211 125 L 206 123 C 206 85, 50 85, 50 123 Z" fill="hsl(var(--border))" transform="rotate(-5 128 125)"/>
        <rect x="40" y="115" width="176" height="15" fill="url(#metalGradSuccess)" transform="rotate(-5 128 122.5)" />

        {/* Lock */}
        <circle cx="128" cy="160" r="15" fill="url(#metalGradSuccess)" />
        <rect x="123" y="162" width="10" height="10" rx="2" fill="hsl(var(--background))" />

        {/* Coins spilling out */}
        <circle cx="128" cy="110" r="12" fill="url(#coinGrad)" />
        <circle cx="150" cy="115" r="10" fill="url(#coinGrad)" />
        <circle cx="106" cy="120" r="14" fill="url(#coinGrad)" />
        <circle cx="90" cy="105" r="11" fill="url(#coinGrad)" />
        <circle cx="165" cy="100" r="12" fill="url(#coinGrad)" />
    </svg>
);


type WithdrawalSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  method: string;
};

export function WithdrawalSuccessModal({ isOpen, onClose, amount, method }: WithdrawalSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="mx-auto mb-4">
            <SuccessIllustration />
          </div>
          <DialogTitle className="text-2xl font-bold font-headline">
            💸 Success!
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground mt-2">
            You just cashed out <span className="font-bold text-primary">${amount.toFixed(2)}</span> via <span className="font-bold text-primary capitalize">{method}</span>. Great job!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground">
            Your request has been submitted and will be processed shortly. You can check the status in your withdrawal history.
          </p>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button type="button" onClick={onClose} size="lg">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
