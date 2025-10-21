
"use client";

import { motion } from "framer-motion";
import { DollarSign, Gift, Trophy } from "lucide-react";

export function HeroIllustration() {
  const cardVariants = {
    initial: { opacity: 0, y: 50, rotate: -5 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        delay: i * 0.2,
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    }),
  };

  return (
    <div className="relative w-full max-w-lg h-64 flex items-center justify-center">
      {/* Floating Card 1 */}
      <motion.div
        className="absolute top-8 left-4 w-48 h-24 bg-card/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-primary/20"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        custom={1}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary/20 rounded-lg">
            <Trophy className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="font-bold text-sm text-foreground">Tournament Win</p>
            <p className="font-bold text-lg text-secondary">+2,500 Pts</p>
          </div>
        </div>
      </motion.div>

      {/* Floating Card 2 */}
      <motion.div
        className="absolute bottom-8 right-4 w-52 h-28 bg-card/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-primary/20 z-10"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        custom={2}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Gift className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-bold text-sm text-foreground">Welcome Bonus</p>
            <p className="font-bold text-lg text-primary">$1.00 Claimed</p>
          </div>
        </div>
      </motion.div>

       {/* Floating Card 3 */}
       <motion.div
        className="absolute top-20 right-8 w-40 h-20 bg-card/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-primary/20"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        custom={3}
      >
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent/20 rounded-lg">
            <DollarSign className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-bold text-xs text-foreground">Survey Payout</p>
            <p className="font-bold text-md text-accent">+500 Pts</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
