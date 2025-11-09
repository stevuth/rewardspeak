
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

const SvgHeading = ({ title }: { title: string }) => {
  const uniqueId = `grad-${title.replace(/\s+/g, '-')}`;
  return (
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
        fontSize="36"
        fontWeight="bold"
        fill={`url(#${uniqueId})`}
        className="font-headline tracking-tight"
        stroke="hsl(var(--background))"
        strokeWidth="0.5"
      >
        {title}
      </text>
    </svg>
  );
};


export function PageHeader({
  title,
  description,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
       <div className={cn("flex", /center/.test(className || '') ? "justify-center" : "justify-start")}>
        <SvgHeading title={title} />
      </div>
      {description && <p className={cn("text-muted-foreground", /center/.test(className || '') && "text-center")}>{description}</p>}
    </div>
  );
}
