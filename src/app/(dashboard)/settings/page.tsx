
import { PageHeader } from "@/components/page-header";
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
import { user, popularOffers } from "@/lib/mock-data";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import type { Metadata } from "next";
import { StatCard } from "@/components/stat-card";
import { DollarSign, CheckCircle, CalendarDays, Upload } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "My Peak Profile",
  description: "Account info, preferences, and personal stats.",
};

export default function MyPeakProfilePage() {
  const completedOffersCount = popularOffers.filter(
    (o) => o.status === "Completed"
  ).length;
  const totalAmountEarned =
    popularOffers
      .filter((o) => o.status === "Completed")
      .reduce((sum, o) => sum + o.points, 0) / 100;

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Peak Profile"
        description="Manage your account and notification settings."
      />

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                This is how others will see you on the site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                   <Label htmlFor="picture">Profile Picture</Label>
                   <div className="flex gap-2 mt-2">
                    <Input id="picture" type="file" className="max-w-xs" />
                    <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Upload</Button>
                   </div>
                   <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB.</p>
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="rewards-peak-id">Rewards Peak ID</Label>
                <Input id="rewards-peak-id" defaultValue={user.rewardsPeakId} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Profile</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Update your password here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <Input id="current_password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input id="new_password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4">
            <StatCard
            title="Total Offers Completed"
            value={completedOffersCount}
            icon={CheckCircle}
            />
            <StatCard
            title="Total Amount Earned"
            value={totalAmountEarned}
            icon={DollarSign}
            />
            <StatCard
            title="Date Joined"
            value={new Date(user.dateJoined).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}
            icon={CalendarDays}
            />
             <Card>
                <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                    Choose what you want to be notified about.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox id="offers" defaultChecked />
                    <Label htmlFor="offers">New Offers</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="payouts" defaultChecked />
                    <Label htmlFor="payouts">Payout confirmations</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="updates" />
                    <Label htmlFor="updates">Product updates</Label>
                </div>
                </CardContent>
                <CardFooter>
                <Button>Save Preferences</Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
