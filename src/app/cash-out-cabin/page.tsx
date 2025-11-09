
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatedCounter } from "@/components/animated-counter";
import { withdrawalMethods } from "@/lib/mock-data";
import { Wallet } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cash-Out Cabin",
  description: "Withdraw points to cash, crypto, or gift cards.",
};

export default function CashOutCabinPage() {
    const totalPoints = 0;
  return (
    <div className="space-y-8">
      <PageHeader
        title="Cash-Out Cabin"
        description="Convert your points into real-world loot."
      />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-primary/50 border-2 shadow-lg shadow-primary/20">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">New Withdrawal</CardTitle>
              <CardDescription>
                Select your method and enter the amount. 1000 points = $1.00.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="method">Withdrawal Method</Label>
                <Select>
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Select a method" />
                  </SelectTrigger>
                  <SelectContent>
                    {withdrawalMethods.map((method) => (
                      <SelectItem key={method.name} value={method.name}>
                        <span className="flex items-center gap-2">
                          {method.name} (Min: {method.min.toLocaleString()}{" "}
                          pts)
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (Points)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 5000"
                  min="1000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallet">Wallet/Account Info</Label>
                <Input
                  id="wallet"
                  type="text"
                  placeholder="e.g., your-paypal@email.com"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg">Request Withdrawal</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Wallet className="h-5 w-5 text-muted-foreground" />
                Your Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-headline">
                <AnimatedCounter value={totalPoints} /> Points
              </div>
              <div className="text-muted-foreground mt-1">
                ≈ $<AnimatedCounter value={totalPoints / 1000} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Withdrawal History</CardTitle>
              <CardDescription>
                Your recent withdrawal requests.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-10">
              <p className="text-sm text-muted-foreground">
                No withdrawal history yet.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
