
"use client";

import { useState } from "react";
import { FuturisticAuthForm } from "./futuristic-auth-form";
import { redirect } from "next/navigation";

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

    const formData = new FormData(e.currentTarget);
    const endpoint = type === "login" ? "/api/auth/login" : "/api/auth/signup";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        setState({ message: result.error || "An unexpected error occurred." });
      } else {
        // On success, redirect from the client-side
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
