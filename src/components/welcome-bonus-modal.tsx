
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
import { GiftIllustration } from "./illustrations/gift";

type WelcomeBonusModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function WelcomeBonusModal({ isOpen, onClose }: WelcomeBonusModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="mx-auto -mt-16 mb-4">
            <GiftIllustration />
          </div>
          <DialogTitle className="text-2xl font-bold font-headline -mt-16">
            Welcome to Rewards Peak!
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground mt-2">
            You’ve just earned a <span className="font-bold text-primary">$1 Welcome Bonus!</span>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground">
            Start exploring offers, surveys, and quick tasks to grow your balance even more.
          </p>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button type="button" onClick={onClose} size="lg">
            Start Earning
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
