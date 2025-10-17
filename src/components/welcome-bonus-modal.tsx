
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
import { Gift } from "lucide-react";

type WelcomeBonusModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function WelcomeBonusModal({ isOpen, onClose }: WelcomeBonusModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20 dark:bg-secondary/30 mb-4">
            <Gift className="h-10 w-10 text-secondary" />
          </div>
          <DialogTitle className="text-2xl font-bold font-headline">
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
