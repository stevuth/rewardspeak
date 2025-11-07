
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type TypewriterEffectProps = {
  sentences: { text: string; colorClass: string }[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenSentences?: number;
};

export function TypewriterEffect({
  sentences,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenSentences = 2000,
}: TypewriterEffectProps) {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentSentence = sentences[sentenceIndex];
  const displayedText = currentSentence.text.substring(0, charIndex);

  const handleTyping = useCallback(() => {
    if (isDeleting) {
      if (charIndex > 0) {
        setCharIndex((prev) => prev - 1);
      } else {
        setIsDeleting(false);
        setSentenceIndex((prev) => (prev + 1) % sentences.length);
      }
    } else {
      if (charIndex < currentSentence.text.length) {
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => setIsDeleting(true), delayBetweenSentences);
      }
    }
  }, [charIndex, currentSentence.text.length, isDeleting, sentences.length, delayBetweenSentences]);

  useEffect(() => {
    const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timer);
  }, [handleTyping, isDeleting, deletingSpeed, typingSpeed]);

  return (
    <div className="relative h-40 md:h-32 text-4xl md:text-6xl font-extrabold tracking-tighter mb-8 text-center">
      <AnimatePresence mode="wait">
        <motion.h1
          key={sentenceIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(currentSentence.colorClass, "whitespace-pre-wrap font-headline")}
        >
          {displayedText}
          {/* Blinking cursor */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className={cn("inline-block w-1 h-10 md:h-14 bg-current ml-1")}
          />
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
