
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

type LoadingOverlayProps = {
  messages: string[];
  duration?: number;
};

export function LoadingOverlay({
  messages,
  duration = 2500,
}: LoadingOverlayProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, duration);

    return () => clearInterval(interval);
  }, [messages.length, duration]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-8" />
      <div className="relative h-10 w-full max-w-sm overflow-hidden text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <p className="text-lg font-medium text-foreground">
              {messages[index]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
