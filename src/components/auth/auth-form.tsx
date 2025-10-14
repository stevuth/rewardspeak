
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gamepad2, Chrome } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  type: "login" | "signup";
  onSwitch?: () => void;
};

export function AuthForm({ type, onSwitch }: AuthFormProps) {
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/dashboard");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNavigation();
  };

  const switchText =
    type === "login"
      ? "New adventurer?"
      : "Already a hero?";
  const switchLinkText = type === "login" ? "Sign up" : "Log in";

  return (
      <Card className="w-full max-w-md border-0 shadow-none rounded-lg">
        <CardHeader className="text-center pt-12">
          <Gamepad2 className="mx-auto h-8 w-8 text-primary" />
          <CardTitle className="mt-4 text-2xl font-bold">
            {type === "login" ? "Welcome Back!" : "Join the Adventure"}
          </CardTitle>
          <CardDescription>
            {type === "login"
              ? "Log in to continue your quest on Rewards Peak."
              : "Create your hero and start earning epic rewards."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="hero@example.com"
                required
                defaultValue="hero@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required defaultValue="password" />
            </div>
            <Button type="submit" className="w-full" onClick={handleNavigation}>
              {type === "login" ? "Enter the Realm" : "Create My Hero"}
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleNavigation}>
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>
        </CardContent>
        <CardFooter className="justify-center text-sm">
          <p>
            {switchText}{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-medium text-primary hover:underline"
              onClick={onSwitch}
              type="button"
            >
              {switchLinkText}
            </Button>
          </p>
        </CardFooter>
      </Card>
  );
}
