
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
  icon?: LucideIcon;
};

const SvgHeading = ({ title, icon: Icon }: { title: string, icon?: LucideIcon }) => {
  const uniqueId = `grad-${title.replace(/\s+/g, '-')}`;
  return (
    <div className="flex items-center gap-3">
        {Icon && <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />}
        <svg viewBox="0 0 400 50" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md h-auto">
            <defs>
                <linearGradient id={uniqueId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--secondary))" />
                <stop offset="50%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
            </defs>
            <text
                x="50%"
                y="50%"
                dy=".3em"
                textAnchor="middle"
                fontWeight="bold"
                fill={`url(#${uniqueId})`}
                className="font-headline tracking-tight text-[28px] sm:text-[36px]"
                stroke="hsl(var(--background))"
                strokeWidth="0.5"
            >
                {title}
            </text>
        </svg>
    </div>
  );
};

const SvgDescription = ({ description }: { description: string }) => {
    const approximateWidth = description.length * 8;
    
    return (
        <svg viewBox={`0 0 ${approximateWidth} 20`} xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl h-auto mt-1">
             <text
                x="50%"
                y="50%"
                dy=".3em"
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                className="font-sans text-sm sm:text-base"
            >
                {description}
            </text>
        </svg>
    )
}


export function PageHeader({
  title,
  description,
  className,
  icon: Icon,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
       <div className={cn("flex items-center", /center/.test(className || '') ? "justify-center" : "justify-start")}>
        <SvgHeading title={title} icon={Icon} />
      </div>
      {description && (
        <div className={cn("flex", /center/.test(className || '') ? "justify-center" : "justify-start")}>
            <SvgDescription description={description} />
        </div>
      )}
    </div>
  );
}
