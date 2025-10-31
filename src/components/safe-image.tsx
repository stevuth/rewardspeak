
"use client";

import NextImage from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SafeImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  [key: string]: any; // Allow other props like data-ai-hint
};

export function SafeImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  
  // Trim whitespace from the src
  const cleanSrc = src ? src.trim() : '';

  const isExternal = cleanSrc && (cleanSrc.startsWith("http") || cleanSrc.startsWith("https"));
  
  // Ensure alt text is a string before calling replace on it
  const safeAlt = alt || 'placeholder';
  const placeholderSrc = `https://picsum.photos/seed/${safeAlt.replace(/\s+/g, '')}/${width || 200}/${height || 200}`;


  const handleError = () => {
    setHasError(true);
  };

  const finalSrc = !cleanSrc || hasError ? placeholderSrc : cleanSrc;

  if (isExternal || hasError) {
    // Use a standard <img> tag for external sources or as a fallback
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onError={handleError}
        className={cn("object-cover", className)}
        {...props}
      />
    );
  }

  // Use Next.js <Image> for local assets
  return (
    <NextImage
      src={cleanSrc}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      onError={handleError}
      {...props}
    />
  );
}
