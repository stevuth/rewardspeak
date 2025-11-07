
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
import { CheckCircle2 } from "lucide-react";

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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
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
