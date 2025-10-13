"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { user } from "@/lib/mock-data";
import { isToday, parseISO } from "date-fns";
import { Gift } from "lucide-react";

export function DailyRewardModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);

  useEffect(() => {
    // Check if the last login was today
    const lastLoginDate = parseISO(user.lastLogin);
    if (isToday(lastLoginDate)) {
      setHasClaimed(true);
    }
  }, []);

  const handleClaim = () => {
    // Here you would typically call an API to:
    // 1. Verify the user can claim the reward.
    // 2. Add points to the user's account.
    // 3. Update the user's last login date.
    console.log("Reward claimed!");
    setHasClaimed(true);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={hasClaimed}
        className="w-full font-bold"
      >
        {hasClaimed ? "Claimed Today" : "Claim Daily Reward"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
              <Gift className="text-primary" /> Daily Login Reward
            </DialogTitle>
            <DialogDescription>
              Thanks for checking in! Here is your daily reward of{" "}
              <span className="font-bold text-primary">500 XP</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-6xl font-bold font-headline text-primary animate-pulse">
              500
            </p>
            <p className="text-muted-foreground">Experience Points</p>
          </div>
          <DialogFooter>
            <Button
              onClick={handleClaim}
              className="w-full"
              size="lg"
            >
              Claim Reward
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
