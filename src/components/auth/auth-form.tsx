
"use client";

import React, { useEffect, useReducer } from "react";
import { useActionState } from "react";
import { login, signup } from "@/app/auth/actions";
import { useToast } from "@/hooks/use-toast";
import { FuturisticAuthForm } from "./futuristic-auth-form";

type AuthFormProps = {
  type: "login" | "signup";
  onSwitch?: () => void;
};

// This component is a wrapper that handles the state and actions for the auth form.
// It uses the visual `FuturisticAuthForm` component for the UI.
export function AuthForm({ type, onSwitch }: AuthFormProps) {
  const isLogin = type === "login";
  const [state, formAction, isPending] = useActionState(
    isLogin ? login : signup,
    { message: "" }
  );

  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.success) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <FuturisticAuthForm
      type={type}
      onSwitch={onSwitch}
      formAction={formAction}
      isPending={isPending}
    />
  );
}
