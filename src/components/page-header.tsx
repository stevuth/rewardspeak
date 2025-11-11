
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
  icon?: LucideIcon; // Keep prop for compatibility, but won't be used
};

const SvgHeading = ({ title }: { title: string }) => {
  const gradId = `grad-${title.replace(/\s+/g, '-')}`;
  const bgGradId = `bg-grad-${title.replace(/\s+/g, '-')}`;

  return (
    <div className="relative">
        <svg
            viewBox="0 0 400 60"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-md h-auto"
            style={{ overflow: 'visible' }}
        >
            <defs>
                 <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--secondary))" />
                    <stop offset="50%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
                <linearGradient id={bgGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary) / 0.1)" />
                    <stop offset="100%" stopColor="hsl(var(--secondary) / 0.1)" />
                </linearGradient>
            </defs>
            
            <path 
                d="M 20 5 C 100 0, 300 0, 380 5 L 380 55 C 300 60, 100 60, 20 55 Z"
                fill={`url(#${bgGradId})`}
                stroke="hsl(var(--border) / 0.5)"
                strokeWidth="1"
            />

            <text
                x="50%"
                y="50%"
                dy=".3em"
                textAnchor="middle"
                fontWeight="bold"
                fill={`url(#${gradId})`}
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
    // A more reliable way to estimate width for various screen sizes.
    const approximateWidth = Math.max(400, description.length * 12);
    
    return (
        <svg viewBox={`0 0 ${approximateWidth} 24`} xmlns="http://www.w3.org/2000/svg" className="w-full h-auto mt-1" preserveAspectRatio="xMinYMid meet">
             <text
                x="0"
                y="50%"
                dy=".3em"
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
  icon,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
       <div className={cn("flex items-center", /center/.test(className || '') ? "justify-center" : "justify-start")}>
        <SvgHeading title={title} />
      </div>
      {description && (
        <div className={cn("flex w-full", /center/.test(className || '') ? "justify-center" : "justify-start")}>
            <SvgDescription description={description} />
        </div>
      )}
    </div>
  );
}
