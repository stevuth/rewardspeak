import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "./animated-counter";

type StatItemProps = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  className?: string;
};

export function StatItem({
  title,
  value,
  icon: Icon,
  className,
}: StatItemProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
        <div className="p-2 bg-muted rounded-md">
            <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="font-semibold text-lg">
                 {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
            </p>
        </div>
    </div>
  );
}
