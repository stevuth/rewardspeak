
"use client";

import React, { useEffect, useState } from "react";
import { useActionState } from "react";
import { useSearchParams } from 'next/navigation';
import { login, signup, requestPasswordReset } from "@/app/auth/actions";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, Lock, Mail, UserPlus, Eye, EyeOff, Send } from "lucide-react";
import Image from "next/image";
import { WavingMascotLoader } from "../waving-mascot-loader";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { Label } from "../ui/label";

type AuthFormProps = {
  type: "login" | "signup";
  onSwitch?: () => void;
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
  Icon,
  required = true,
  isPassword = false,
  showPassword,
  toggleShowPassword
}: {
  id: string;
  name: string;
  type: string;
  Icon: React.ElementType;
  required?: boolean;
  isPassword?: boolean;
  showPassword?: boolean;
  toggleShowPassword?: () => void;
}) => {
  return (
    <div className="relative">
      <div className="animated-border-wrap rounded-lg">
        <div className="relative">
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
          <input
            id={id}
            name={name}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            placeholder=" " // Important for the floating label effect
            className="floating-label-input block w-full bg-[#1A0033]/80 rounded-md py-3 pl-10 pr-10 text-base text-gray-200 placeholder-gray-500 appearance-none focus:outline-none focus:ring-0 relative z-20"
            required={required}
          />
           {isPassword && (
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
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

function ForgotPasswordModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const [state, formAction, isPending] = useActionState(requestPasswordReset, { message: "", success: false });
    const { toast } = useToast();
    
    useEffect(() => {
        if (state.message) {
            toast({
                variant: state.success ? "default" : "destructive",
                title: state.success ? "Request Sent" : "Request Failed",
                description: state.message,
            });
            if (state.success) {
                setTimeout(() => onOpenChange(false), 500);
            }
        }
    }, [state, toast, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#15002B] to-[#240046] border-primary/20">
                <DialogHeader>
                    <DialogTitle>Forgot Password</DialogTitle>
                    <DialogDescription>
                        Enter your email address and we'll send you a link to reset your password.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction}>
                    <div className="py-4 space-y-2">
                        <Label htmlFor="reset-email">Email Address</Label>
                        <FloatingLabelInput
                            id="reset-email"
                            name="email"
                            type="email"
                            Icon={Mail}
                        />
                    </div>
                    <DialogFooter>
                        <button type="submit" disabled={isPending} className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                             {isPending ? (
                                <WavingMascotLoader messages={["Sending..."]} />
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" /> Send Reset Link
                                </>
                            )}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function FuturisticAuthForm({
  type,
  onSwitch,
}: AuthFormProps) {
  const isLogin = type === "login";
  const [state, formAction, isPending] = useActionState(
    isLogin ? login : signup,
    { message: "" }
  );

  const { toast } = useToast();
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref') || '';
  const [referralCode, setReferralCode] = useState(refCode);


  useEffect(() => {
    if (state.message && !state.success) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: state.message,
      });
    }
  }, [state, toast]);

  useEffect(() => {
    setReferralCode(refCode);
  }, [refCode]);

  const [ipAddress, setIpAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const toggleShowPassword = () => setShowPassword(prev => !prev);

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
    <>
      <ForgotPasswordModal open={showForgotModal} onOpenChange={setShowForgotModal} />
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
              <form action={formAction} className="space-y-4" noValidate>
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

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-400 text-base">Email Address</Label>
                    <FloatingLabelInput
                        id="email"
                        name="email"
                        type="email"
                        Icon={Mail}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="password" className="text-gray-400 text-base">Password</Label>
                        {isLogin && (
                            <button type="button" onClick={() => setShowForgotModal(true)} className="text-xs font-semibold text-secondary hover:text-secondary/80 transition">
                                Forgot Password?
                            </button>
                        )}
                    </div>
                    <FloatingLabelInput
                        id="password"
                        name="password"
                        type="password"
                        Icon={Lock}
                        isPassword={true}
                        showPassword={showPassword}
                        toggleShowPassword={toggleShowPassword}
                    />
                </div>

                {!isLogin && (
                  <>
                    <div className="space-y-2">
                        <Label htmlFor="referral_code" className="text-gray-400 text-base">Referral Code (Optional)</Label>
                        <FloatingLabelInput
                            id="referral_code"
                            name="referral_code"
                            type="text"
                            Icon={UserPlus}
                            required={false}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="accepted_terms" name="accepted_terms" required />
                      <Label htmlFor="accepted_terms" className="text-xs text-gray-400">
                        I agree to the{" "}
                        <Link href="/terms-of-the-peak" target="_blank" className="underline text-secondary hover:text-secondary/80">
                          Terms of Use
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy-trail" target="_blank" className="underline text-secondary hover:text-secondary/80">
                          Privacy Policy
                        </Link>
                        .
                      </Label>
                    </div>
                  </>
                )}
                
                {/* Hidden input for IP address */}
                <input type="hidden" name="ip_address" value={ipAddress} />

                <SubmitButton isLogin={isLogin} isPending={isPending} />
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
