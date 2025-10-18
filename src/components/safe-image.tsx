
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
  const isExternal = src && (src.startsWith("http") || src.startsWith("https"));
  const placeholderSrc = `https://picsum.photos/seed/${alt.replace(/\s+/g, '')}/${width || 200}/${height || 200}`;


  const handleError = () => {
    setHasError(true);
  };

  if (!src || hasError) {
    // Render a placeholder if src is missing or an error occurred
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={placeholderSrc}
        alt="Placeholder image"
        width={width}
        height={height}
        loading="lazy"
        className={cn("object-cover", className)}
      />
    );
  }

  if (isExternal) {
    // Use a standard <img> tag for external sources
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
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
      src={src}
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
