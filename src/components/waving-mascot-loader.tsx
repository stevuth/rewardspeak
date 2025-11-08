
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export const WavingMascotLoader = ({ text, messages, duration = 2500 }: { text?: string, messages?: string[], duration?: number }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (messages && messages.length > 1) {
            const interval = setInterval(() => {
                setIndex((prevIndex) => (prevIndex + 1) % messages.length);
            }, duration);

            return () => clearInterval(interval);
        }
    }, [messages, duration]);
    
    const armVariants = {
        dance: {
            rotate: [15, -15, 15],
            transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
        }
    };
    const legVariants = {
        dance: (i: number) => ({
            y: ["0%", i % 2 === 0 ? "-10%" : "10%", "0%"],
            transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
        })
    };
    const bodyVariants = {
        bounce: {
            y: ["0%", "-5%", "0%"],
            transition: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }
    };

    const displayText = messages && messages.length > 0 ? messages[index] : text;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <motion.div className="relative w-16 h-16" variants={bodyVariants} animate="bounce">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Legs */}
                    <motion.rect x="35" y="80" width="10" height="15" rx="5" fill="hsl(var(--primary))" variants={legVariants} custom={0} animate="dance" />
                    <motion.rect x="55" y="80" width="10" height="15" rx="5" fill="hsl(var(--primary))" variants={legVariants} custom={1} animate="dance" />
                    
                    {/* Body */}
                    <circle cx="50" cy="60" r="30" fill="hsl(var(--primary))" />
                    
                    {/* Eyes */}
                    <circle cx="42" cy="55" r="4" fill="white" />
                    <circle cx="58" cy="55" r="4" fill="white" />
                    <circle cx="43" cy="56" r="2" fill="black" />
                    <circle cx="59" cy="56" r="2" fill="black" />
                    
                    {/* Smile */}
                    <path d="M 45 70 Q 50 78, 55 70" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                    
                    {/* Arms */}
                    <motion.rect x="15" y="55" width="10" height="25" rx="5" fill="hsl(var(--primary))" style={{ originX: '20px', originY: '60px' }} variants={armVariants} animate="dance" />
                    <motion.rect x="75" y="55" width="10" height="25" rx="5" fill="hsl(var(--primary))" style={{ originX: '80px', originY: '60px' }} variants={armVariants} animate="dance" />
                </svg>
            </motion.div>
            
            <div className="relative h-6 w-full text-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={displayText || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-primary whitespace-nowrap"
                    >
                      {displayText}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
};
