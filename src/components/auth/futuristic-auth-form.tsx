
"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, LogIn, Mail, Lock } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type AuthFormProps = {
  type: "login" | "signup";
  onSwitch?: () => void;
  formAction: (payload: FormData) => void;
  state: { message: string };
  pending: boolean;
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
}: {
  id: string;
  name: string;
  type: string;
  label: string;
  defaultValue?: string;
  Icon: React.ElementType;
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
            required
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

export function FuturisticAuthForm({
  type,
  onSwitch,
  formAction,
  state,
  pending,
}: AuthFormProps) {
  const searchParams = useSearchParams();
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) {
      setReferralCode(refFromUrl);
    }
  }, [searchParams]);

  const isLogin = type === "login";

  return (
    <div className="futuristic-auth-form w-full max-w-4xl min-h-[auto] md:min-h-[550px] bg-gradient-to-br from-[#15002B] to-[#240046] rounded-2xl shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="relative w-full md:w-2/5 p-8 flex flex-col justify-center items-center text-center text-white">
        <div className="absolute inset-0 bg-black/20 opacity-50 z-0"></div>
        <div className="relative z-10">
          <Image
            src="/logo.png?v=9"
            alt="Rewards Peak Logo"
            width={60}
            height={60}
            className="mx-auto mb-4"
          />
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
            <form action={formAction} className="space-y-6">
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
              <FloatingLabelInput
                id="password"
                name="password"
                type="password"
                label="Password"
                Icon={Lock}
              />

              {!isLogin && (
                <FloatingLabelInput
                  id="referral_code"
                  name="referral_code"
                  type="text"
                  label="Referral Code (Optional)"
                  defaultValue={referralCode}
                  Icon={UserPlus}
                />
              )}

              {state.message && (
                <p className="text-sm text-red-400">{state.message}</p>
              )}

              <button
                type="submit"
                disabled={pending}
                className={cn(
                    "w-full relative overflow-hidden flex justify-center items-center bg-secondary text-secondary-foreground font-bold py-3 px-4 rounded-lg hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary/50 focus:ring-offset-[#15002B] transition-all duration-300 ease-in-out transform hover:scale-[1.02] disabled:opacity-75 disabled:cursor-not-allowed",
                    pending && "bg-secondary/20 text-secondary"
                )}
              >
                <AnimatePresence>
                  {pending ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="w-full text-center"
                    >
                      <p className="text-xs font-semibold mb-1.5">Loading your rewards vault...</p>
                      <div className="w-full bg-secondary/20 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          className="bg-secondary h-1.5 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        ></motion.div>
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
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#15002B]/50 px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <button className="w-full py-3 px-4 rounded-lg bg-white/5 border border-white/10 text-white font-semibold flex items-center justify-center hover:bg-white/10 transition-transform duration-300 transform hover:scale-[1.02]">
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-5 w-5"
              >
                <title>Google</title>
                <path
                  fill="currentColor"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.96-4.66 1.96-3.88 0-7.03-3.15-7.03-7.03s3.15-7.03 7.03-7.03c2.25 0 3.67.92 4.48 1.68l2.54-2.54C18.33 2.92 15.78 2 12.48 2 6.87 2 2.52 6.49 2.52 12s4.35 10 9.96 10c5.79 0 9.5-4.04 9.5-9.66 0-.64-.07-1.25-.16-1.84z"
                />
              </svg>
              Google
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
