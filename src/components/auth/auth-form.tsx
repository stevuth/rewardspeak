
"use client";

import { useFormState } from "react-dom";
import { login, signup } from "@/app/auth/actions";
import { FuturisticAuthForm } from "./futuristic-auth-form";

export function AuthForm({
  type,
  onSwitch,
}: {
  type: "login" | "signup";
  onSwitch?: () => void;
}) {
  const [state, formAction] = useFormState(type === 'login' ? login : signup, { message: "" });
  
  return (
    <FuturisticAuthForm
      type={type}
      onSwitch={onSwitch}
      formAction={formAction}
      state={state}
    />
  );
}
