
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
import { LogOut } from "lucide-react";

type LogoutSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LogoutSuccessModal({ isOpen, onClose }: LogoutSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <LogOut className="h-10 w-10 text-muted-foreground" />
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
