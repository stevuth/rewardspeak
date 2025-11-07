
"use client";

import { motion } from "framer-motion";

export const WavingMascotLoader = ({ text }: { text?: string }) => {
    const waveVariants = {
        wave: {
            rotate: [0, 20, -15, 20, -15, 0],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const bodyVariants = {
        bounce: {
            y: ["0%", "5%", "0%"],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
            <motion.div
                className="relative w-20 h-20"
                variants={bodyVariants}
                animate="bounce"
            >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Body */}
                    <circle cx="50" cy="60" r="30" fill="hsl(var(--primary))" />
                    
                    {/* Eyes */}
                    <circle cx="42" cy="55" r="4" fill="white" />
                    <circle cx="58" cy="55" r="4" fill="white" />
                    <circle cx="43" cy="56" r="2" fill="black" />
                    <circle cx="59" cy="56" r="2" fill="black" />
                     
                    {/* Smile */}
                    <path d="M 45 70 Q 50 78, 55 70" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                    
                    {/* Waving Arm */}
                    <motion.g
                        style={{ originX: '70px', originY: '60px' }}
                        variants={waveVariants}
                        animate="wave"
                    >
                         <path d="M 70,60 C 80,50 90,65 80,75" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round" />
                    </motion.g>
                </svg>
            </motion.div>
            {text && <p className="text-sm font-semibold text-primary mt-1">{text}</p>}
        </div>
    );
};
