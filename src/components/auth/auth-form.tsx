
"use client";

import { useActionState } from "react";
import { login, signup } from "@/app/auth/actions";
import { FuturisticAuthForm } from "./futuristic-auth-form";

export function AuthForm({
  type,
  onSwitch,
}: {
  type: "login" | "signup";
  onSwitch?: () => void;
}) {
  const [state, formAction] = useActionState(type === 'login' ? login : signup, { message: "" });
  
  return (
    <FuturisticAuthForm
      type={type}
      onSwitch={onSwitch}
      formAction={formAction}
      state={state}
    />
  );
}
