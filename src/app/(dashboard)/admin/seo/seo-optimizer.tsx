"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { runSeoOptimizer } from "@/app/actions";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  keywords: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type OptimizedContent = {
  optimizedTitle: string;
  optimizedDescription: string;
};

export function SeoOptimizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizedContent | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      keywords: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);

    const actionResult = await runSeoOptimizer(data);

    if (actionResult.success && actionResult.data) {
      setResult(actionResult.data);
      toast({
        title: "Optimization Complete!",
        description: "AI suggestions have been generated below.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: actionResult.error || "An unexpected error occurred.",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Input Content</CardTitle>
              <CardDescription>
                Enter your current meta tags to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Your current page title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your current page description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., earn money, online tasks"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Optimize with AI
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Suggestions</CardTitle>
          <CardDescription>
            Optimized content will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {result && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Optimized Title</Label>
                <p className="mt-1 rounded-md border bg-muted p-3 text-sm">
                  {result.optimizedTitle}
                </p>
              </div>
              <div>
                <Label className="text-sm font-semibold">
                  Optimized Description
                </Label>
                <p className="mt-1 rounded-md border bg-muted p-3 text-sm">
                  {result.optimizedDescription}
                </p>
              </div>
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex items-center justify-center text-center py-10">
              <p className="text-sm text-muted-foreground">
                Run the optimizer to see AI suggestions.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
