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
import { user, withdrawalMethods } from "@/lib/mock-data";
import { DollarSign, Wallet } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Withdraw",
  description: "Withdraw your earnings from Rewards Peak.",
};

export default function WithdrawPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Withdraw Earnings"
        description="Convert your points into real money."
      />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>New Withdrawal</CardTitle>
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
                        {method.name} (Min: {method.min.toLocaleString()} pts)
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
                  min="5000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallet">
                  PayPal Email / Crypto Address
                </Label>
                <Input
                  id="wallet"
                  type="text"
                  placeholder="your-wallet-address"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Request Withdrawal</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-muted-foreground" />
                Your Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <AnimatedCounter value={user.totalPoints} /> Points
              </div>
              <div className="text-muted-foreground mt-1">
                ≈ $<AnimatedCounter value={user.totalPoints / 1000} />
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
              <CardDescription>Your recent withdrawal requests.</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-10">
                <p className="text-sm text-muted-foreground">No withdrawal history yet.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
