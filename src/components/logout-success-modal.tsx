
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const LogoutIllustration = () => (
    <svg width="128" height="128" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
        <defs>
             <linearGradient id="peakGradLogout" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--muted))" />
                <stop offset="100%" stopColor="hsl(var(--border))" />
            </linearGradient>
             <linearGradient id="skyGradLogout" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary) / 0.1)" />
                <stop offset="100%" stopColor="hsl(var(--background))" />
            </linearGradient>
        </defs>

        {/* Sky */}
        <circle cx="128" cy="128" r="100" fill="url(#skyGradLogout)" />
        
        {/* Mountain Peaks */}
        <path d="M30 200 L 100 100 L 170 200 Z" fill="url(#peakGradLogout)" />
        <path d="M120 200 L 170 120 L 220 200 Z" fill="url(#peakGradLogout)" opacity="0.8" />
        
        {/* Mascot */}
        <g transform="translate(110 120)">
            <circle cx="28" cy="28" r="28" fill="hsl(var(--primary))" />
            <circle cx="20" cy="22" r="3" fill="white" />
            <circle cx="36" cy="22" r="3" fill="white" />
            <path d="M22 35 Q 28 32, 34 35" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Waving Arm */}
            <path d="M56 28 C 70 10, 80 20, 85 35" stroke="hsl(var(--primary))" strokeWidth="10" fill="none" strokeLinecap="round" />
        </g>
    </svg>
);


type LogoutSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LogoutSuccessModal({ isOpen, onClose }: LogoutSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="mx-auto mb-4">
            <LogoutIllustration />
          </div>
          <DialogTitle className="text-2xl font-bold font-headline">
            See You Soon!
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground mt-2">
            You have successfully logged out. Your rewards are waiting for your next visit!
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
