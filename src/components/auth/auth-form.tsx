
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, signup } from "@/app/auth/actions";
import { FuturisticAuthForm } from "./futuristic-auth-form";

type AuthFormState = {
    message: string;
    success?: boolean;
    userEmail?: string;
    isNewUser?: boolean;
}

export function AuthForm({
  type,
  onSwitch,
}: {
  type: "login" | "signup";
  onSwitch?: () => void;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState<AuthFormState, FormData>(type === 'login' ? login : signup, { message: "" });
  
  useEffect(() => {
    if (state.success) {
      if (state.isNewUser) {
        router.push('/dashboard?verified=true');
      } else {
        router.push(`/dashboard?event=login&user_email=${encodeURIComponent(state.userEmail || '')}`);
      }
      router.refresh(); // Ensure the layout re-renders with the new user state
    }
  }, [state, router]);

  return (
    <FuturisticAuthForm
      type={type}
      onSwitch={onSwitch}
      formAction={formAction}
      state={state}
    />
  );
}
