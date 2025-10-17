
"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

type RewardToastProps = {
  message: string;
  icon: React.ElementType; // Use ElementType for component props
  username?: string;
};

// A helper to highlight the username with the accent color
const HighlightedMessage = ({ message, username }: { message: string; username?: string }) => {
  if (!username || !message.includes(username)) {
    return <>{message}</>;
  }
  const parts = message.split(username);
  return (
    <>
      {parts[0]}
      <span className="font-bold text-accent">{username}</span>
      {parts[1]}
    </>
  );
};

export function RewardToast({ message, icon: Icon, username }: RewardToastProps) {
  return (
    <div
      className={cn(
        "relative flex w-full max-w-sm items-start space-x-4 overflow-hidden rounded-2xl p-4 shadow-lg",
        "text-white bg-gradient-to-br from-[hsl(var(--reward-toast-start))] to-[hsl(var(--reward-toast-end))] border border-border/50"
      )}
    >
      <div className="flex-shrink-0 mt-1">
        {Icon && <Icon className="h-6 w-6 text-accent" />}
      </div>
      <div className="flex-1 space-y-1 text-sm">
        <p>
            <HighlightedMessage message={message} username={username} />
        </p>
      </div>
    </div>
  );
}
