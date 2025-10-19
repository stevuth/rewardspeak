
"use client";

import { login, signup } from "@/app/auth/actions";
import { useActionState } from "react";
import { FuturisticAuthForm } from "./futuristic-auth-form";

export function AuthForm({
  type,
  onSwitch,
}: {
  type: "login" | "signup";
  onSwitch?: () => void;
}) {
  const [loginState, loginAction, isLoginPending] = useActionState(login, { message: "" });
  const [signupState, signupAction, isSignupPending] = useActionState(signup, { message: "" });

  const state = type === "login" ? loginState : signupState;
  const formAction = type === "login" ? loginAction : signupAction;
  const pending = type === 'login' ? isLoginPending : isSignupPending;

  return (
    <FuturisticAuthForm
      type={type}
      onSwitch={onSwitch}
      formAction={formAction}
      state={state}
      pending={pending}
    />
  );
}
