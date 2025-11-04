
"use client";

import { useState } from "react";
import { FuturisticAuthForm } from "./futuristic-auth-form";

export function AuthForm({
  type,
  onSwitch,
}: {
  type: "login" | "signup";
  onSwitch?: () => void;
}) {
  const [state, setState] = useState<{ message: string }>({ message: "" });
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setState({ message: "" });

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const referralCode = (form.elements.namedItem('referral_code') as HTMLInputElement)?.value;

    const payload = {
      email,
      password,
      referral_code: referralCode,
    };
    
    const endpoint = type === "login" ? "/api/auth/login" : "/api/auth/signup";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        setState({ message: result.error || "An unexpected error occurred." });
      } else {
        if (type === 'login') {
            const userEmail = result.userEmail || '';
            window.location.href = `/dashboard?event=login&user_email=${encodeURIComponent(userEmail)}`;
        } else {
            window.location.href = '/auth/confirm';
        }
      }
    } catch (error) {
      setState({ message: "A network error occurred. Please try again." });
    } finally {
      setPending(false);
    }
  };

  return (
    <FuturisticAuthForm
      type={type}
      onSwitch={onSwitch}
      onSubmit={handleSubmit}
      state={state}
      pending={pending}
    />
  );
}
