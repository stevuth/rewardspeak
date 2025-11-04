
"use client";

import { useActionState, useEffect } from "react";
import { login, signup } from "@/app/auth/actions";
import { FuturisticAuthForm } from "./futuristic-auth-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function AuthForm({
  type,
  onSwitch,
}: {
  type: "login" | "signup";
  onSwitch?: () => void;
}) {
  const [state, formAction, isPending] = useActionState(type === 'login' ? login : signup, { message: "", success: false });
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (state.success && type === 'login') {
      router.push('/dashboard?event=login');
    } else if (state.message && !isPending && !state.success) {
      // Show error toast only if there's an error message and the form is not pending
      toast({
        variant: 'destructive',
        title: "Authentication Error",
        description: state.message,
      });
    }
  }, [state, type, router, toast, isPending]);

  return (
    <FuturisticAuthForm
      type={type}
      onSwitch={onSwitch}
      formAction={formAction}
      state={state}
      isPending={isPending}
    />
  );
}
