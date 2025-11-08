
"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, Lock, Mail, UserPlus, KeyRound, Mountain } from "lucide-react";
import Image from "next/image";
import { WavingMascotLoader } from "../waving-mascot-loader";

import { cn } from "@/lib/utils";

type AuthFormProps = {
  type: "login" | "signup";
  onSwitch?: () => void;
  formAction: (payload: FormData) => void;
  state: { message: string; success?: boolean };
  isPending: boolean;
};

const pageVariants = {
  initial: { opacity: 0, x: 300 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -300 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const FloatingLabelInput = ({
  id,
  name,
  type,
  label,
  defaultValue = "",
  Icon,
  required = true,
}: {
  id: string;
  name: string;
  type: string;
  label: string;
  defaultValue?: string;
  Icon: React.ElementType;
  required?: boolean;
}) => {
  return (
    <div className="relative">
      <div className="animated-border-wrap rounded-lg">
        <div className="relative">
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
          <input
            id={id}
            name={name}
            type={type}
            defaultValue={defaultValue}
            placeholder=" " // Important for the floating label effect
            className="floating-label-input block w-full bg-[#1A0033]/80 rounded-md py-3 pl-10 pr-3 text-base text-gray-200 placeholder-gray-500 appearance-none focus:outline-none focus:ring-0 relative z-20"
            required={required}
          />
          <label
            htmlFor={id}
            className="absolute top-1/2 left-10 -translate-y-1/2 text-gray-400 text-base duration-300 origin-[0] pointer-events-none z-30"
          >
            {label}
          </label>
        </div>
      </div>
    </div>
  );
};

const loadingMessages = [
    "Authenticating...",
    "Securing connection...",
    "Checking credentials...",
    "Almost there...",
];

const SubmitButton = ({ isLogin, isPending }: { isLogin: boolean, isPending: boolean }) => {
    return (
        <button
            type="submit"
            disabled={isPending}
            className={cn(
                "w-full relative overflow-hidden flex justify-center items-center bg-secondary text-secondary-foreground font-bold py-3 px-4 rounded-lg hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary/50 focus:ring-offset-[#15002B] transition-all duration-300 ease-in-out transform hover:scale-[1.02] disabled:opacity-75 disabled:cursor-not-allowed",
                isPending ? "h-[80px] bg-primary/10 text-primary" : "h-[54px]"
            )}
        >
        <AnimatePresence>
          {isPending ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col justify-center items-center"
            >
              <div className="mb-2">
                <WavingMascotLoader messages={loadingMessages} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center"
            >
              {isLogin ? (
                <LogIn className="mr-2 h-5 w-5" />
              ) : (
                <UserPlus className="mr-2 h-5 w-5" />
              )}
              {isLogin ? "Sign In Securely" : "Create Account"}
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    )
}

export function FuturisticAuthForm({
  type,
  onSwitch,
  formAction,
  state,
  isPending
}: AuthFormProps) {
  const isLogin = type === "login";
  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    // Fetch the client's IP address when the component mounts
    const fetchIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error('Failed to fetch IP address:', error);
        // We can proceed without the IP, the server will handle the missing field
      }
    };
    fetchIp();
  }, []);

  return (
    <div className="futuristic-auth-form w-full max-w-sm md:max-w-4xl min-h-[auto] md:min-h-[550px] bg-gradient-to-br from-[#15002B] to-[#240046] rounded-2xl shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="relative w-full md:w-2/5 px-4 py-2 md:p-6 flex flex-col justify-center items-center text-center text-white">
        <div className="absolute inset-0 bg-black/20 opacity-50 z-0"></div>
        <div className="relative z-10">
          <Image
            src="/logo.png?v=9"
            alt="Rewards Peak Logo"
            width={60}
            height={60}
            className="mx-auto"
          />
          <span className="text-sm font-semibold text-gray-300 -mt-2 block mb-4">Rewards Peak</span>
          <h2 className="text-3xl font-bold mb-2">
            {isLogin ? "Welcome Back" : "Start Your Climb"}
          </h2>
          <p className="text-gray-300 text-sm">
            {isLogin
              ? "Your next reward is just a login away. Peak performance awaits."
              : "Join an elite community earning real rewards. The summit is waiting."}
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-3/5 p-8 md:p-12 bg-black/20 backdrop-blur-sm flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={type}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="w-full"
          >
            <form action={formAction} className="space-y-4">
              <h1 className="text-3xl font-bold text-white mb-2">
                {isLogin ? "Sign In" : "Create Account"}
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                {isLogin ? "Not a member?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={onSwitch}
                  className="font-semibold text-secondary hover:text-secondary/80 transition"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>

              <FloatingLabelInput
                id="email"
                name="email"
                type="email"
                label="Email Address"
                Icon={Mail}
              />
              <div className="relative">
                <FloatingLabelInput
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  Icon={Lock}
                />
                {isLogin && (
                    <button type="button" className="absolute top-0 right-0 text-xs font-semibold text-secondary hover:text-secondary/80 transition mt-1">
                        Forgot Password?
                    </button>
                )}
              </div>

              {!isLogin && (
                <FloatingLabelInput
                  id="referral_code"
                  name="referral_code"
                  type="text"
                  label="Referral Code (Optional)"
                  Icon={UserPlus}
                  required={false}
                />
              )}
              
              {/* Hidden input for IP address */}
              <input type="hidden" name="ip_address" value={ipAddress} />

              <SubmitButton isLogin={isLogin} isPending={isPending} />
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
