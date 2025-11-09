
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

const LoginIllustration = () => (
    <svg width="128" height="128" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto drop-shadow-lg">
        <defs>
            <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
            </linearGradient>
            <linearGradient id="flameGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--secondary))" />
                <stop offset="100%" stopColor="hsl(var(--secondary) / 0.5)" />
            </linearGradient>
        </defs>
        
        {/* Rocket Body */}
        <g transform="translate(40 20) rotate(-45 128 128)">
            <path d="M128 40 C 160 80, 160 160, 128 200 C 96 160, 96 80, 128 40 Z" fill="url(#rocketGrad)" />
            <circle cx="128" cy="110" r="20" fill="hsl(var(--card))" />
             {/* Mascot inside */}
            <circle cx="128" cy="110" r="10" fill="hsl(var(--primary))" />
            <circle cx="124" cy="108" r="1.5" fill="white" />
            <circle cx="132" cy="108" r="1.5" fill="white" />
            <path d="M125 114 Q 128 117, 131 114" stroke="white" strokeWidth="1" fill="none" />

            {/* Fins */}
            <path d="M128 200 L 100 220 L 110 200 Z" fill="hsl(var(--primary))" />
            <path d="M128 200 L 156 220 L 146 200 Z" fill="hsl(var(--primary))" />
        </g>
        
        {/* Flames */}
        <path d="M110 180 C 120 220, 140 220, 150 180 L 130 210 Z" fill="url(#flameGrad)" />
        <path d="M100 170 C 110 200, 120 200, 130 170 L 115 190 Z" fill="url(#flameGrad)" opacity="0.7" />

        {/* Stars */}
        <path d="M60 70 L65 80 L70 70 L75 80 L80 70 L70 85 Z" fill="hsl(var(--secondary))" opacity="0.8" />
        <path d="M190 150 L193 155 L196 150 L199 155 L202 150 L196 160 Z" fill="hsl(var(--secondary))" opacity="0.6" />
    </svg>
);


type LoginSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LoginSuccessModal({ isOpen, onClose }: LoginSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="mx-auto mb-4">
            <LoginIllustration />
          </div>
          <DialogTitle className="text-2xl font-bold font-headline">
            Welcome Back!
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground mt-2">
            It's a great day to climb the peaks. Your next reward is just a few clicks away.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button type="button" onClick={onClose} size="lg">
            Let's Go!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
