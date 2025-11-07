
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type Word = {
  text: string;
  colorClass: string;
};

type Sentence = {
  words: Word[];
};

type TypewriterEffectProps = {
  sentences: Sentence[];
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
  const fullText = currentSentence.words.map(w => w.text).join(' ');

  const handleTyping = useCallback(() => {
    if (isDeleting) {
      if (charIndex > 0) {
        setCharIndex((prev) => prev - 1);
      } else {
        setIsDeleting(false);
        setSentenceIndex((prev) => (prev + 1) % sentences.length);
      }
    } else {
      if (charIndex < fullText.length) {
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => setIsDeleting(true), delayBetweenSentences);
      }
    }
  }, [charIndex, fullText.length, isDeleting, sentences.length, delayBetweenSentences]);

  useEffect(() => {
    const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timer);
  }, [handleTyping, isDeleting, deletingSpeed, typingSpeed]);

  const renderWords = () => {
    let charCount = 0;
    const displayedWords = [];

    for (const word of currentSentence.words) {
      const wordText = word.text + ' ';
      if (charCount + wordText.length <= charIndex) {
        // Full word
        displayedWords.push(
          <span key={charCount} className={cn(word.colorClass)}>
            {wordText}
          </span>
        );
        charCount += wordText.length;
      } else if (charCount < charIndex) {
        // Partial word
        const partialText = wordText.substring(0, charIndex - charCount);
        displayedWords.push(
          <span key={charCount} className={cn(word.colorClass)}>
            {partialText}
          </span>
        );
        charCount = charIndex;
        break; 
      } else {
        break;
      }
    }
    return displayedWords;
  };

  return (
    <h1 className="relative h-40 md:h-32 text-4xl md:text-6xl font-extrabold tracking-tighter mb-8 text-center font-headline">
      <AnimatePresence mode="wait">
        <motion.div
          key={sentenceIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="whitespace-pre-wrap"
        >
          {renderWords()}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className={cn("inline-block w-1 h-10 md:h-14 bg-current ml-1")}
          />
        </motion.div>
      </AnimatePresence>
    </h1>
  );
}
