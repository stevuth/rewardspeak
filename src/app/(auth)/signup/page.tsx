import { AuthForm } from "@/components/auth/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account on Rewards Peak.",
};

export default function SignupPage() {
  return <AuthForm type="signup" />;
}
