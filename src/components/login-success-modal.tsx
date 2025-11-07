
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
import { Rocket } from "lucide-react";

type LoginSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LoginSuccessModal({ isOpen, onClose }: LoginSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 mb-4">
            <Rocket className="h-10 w-10 text-primary" />
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
