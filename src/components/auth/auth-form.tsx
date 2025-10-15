
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Gamepad2, Chrome, Loader2 } from "lucide-react";
import { useAuth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

type AuthFormProps = {
  type: "login" | "signup";
  onSwitch?: () => void;
  onSuccess?: () => void;
};

export function AuthForm({ type, onSwitch, onSuccess }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    try {
      if (type === "signup") {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        toast({ title: "Account created successfully!" });
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast({ title: "Logged in successfully!" });
      }
      onSuccess?.();
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({ title: "Logged in with Google successfully!" });
      onSuccess?.();
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", {
        type: "manual",
        message: "Please enter your email to reset your password.",
      });
      return;
    }
    
    // Clear previous error message if any
    form.clearErrors("email");

    setIsResettingPassword(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for a link to reset your password.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description: error.code === 'auth/user-not-found' ? 'No user found with this email.' : 'An unexpected error occurred.'
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const switchText =
    type === "login" ? "New adventurer?" : "Already a hero?";
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="hero@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                    <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        {type === "login" && (
                            <Button
                            type="button"
                            variant="link"
                            className="p-0 h-auto text-xs"
                            onClick={handlePasswordReset}
                            disabled={isResettingPassword}
                            >
                            Forgot Password?
                            </Button>
                        )}
                    </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading || isResettingPassword}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                type === "login" ? "Enter the Realm" : "Create My Hero"
              )}
            </Button>
          </form>
        </Form>
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
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </>
          )}
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
            disabled={isLoading}
          >
            {switchLinkText}
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
