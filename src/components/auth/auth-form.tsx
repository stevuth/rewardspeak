"use client";

import { login, signup } from "@/app/auth/actions";
import { useActionState, useEffect, useState } from "react";
import { FuturisticAuthForm } from "./futuristic-auth-form";

export function AuthForm({
  type,
  onSwitch,
}: {
  type: "login" | "signup";
  onSwitch?: () => void;
}) {
  const [loginState, loginAction] = useActionState(login, { message: "" });
  const [signupState, signupAction] = useActionState(signup, { message: "" });

  const state = type === "login" ? loginState : signupState;
  const formAction = type === "login" ? loginAction : signupAction;
  const { pending } = (formAction as any).pending; // A bit of a hack to get pending state

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
