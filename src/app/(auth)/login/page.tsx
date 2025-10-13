import { AuthForm } from "@/components/auth/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your Rewards Peak account.",
};

export default function LoginPage() {
  return <AuthForm type="login" />;
}
