"use client";

import { useEffect, useRef, useState } from "react";

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function usePrevious(value: number) {
  const ref = useRef<number>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

type AnimatedCounterProps = {
  value: number;
  duration?: number;
  className?: string;
};

export function AnimatedCounter({
  value,
  duration = 1000,
  className,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const prevValue = usePrevious(value) ?? 0;

  useEffect(() => {
    let animationFrameId: number;
    let startTimestamp: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = timestamp - startTimestamp;
      const percentage = Math.min(progress / duration, 1);
      const easedProgress = easeOutExpo(percentage);
      const newCount = prevValue + (value - prevValue) * easedProgress;

      setCount(newCount);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value, prevValue, duration]);

  return <span className={className}>{Math.round(count).toLocaleString()}</span>;
}
