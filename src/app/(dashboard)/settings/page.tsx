

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
import { popularOffers } from "@/lib/mock-data";
import { Textarea } from "@/components/ui/textarea";
import type { Metadata } from "next";
import { DollarSign, CheckCircle, CalendarDays, Upload, Fingerprint } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatItem } from "@/components/stat-item";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "My Peak Profile",
  description: "Account info, preferences, and personal stats.",
};

export default function MyPeakProfilePage() {
  const completedOffersCount = 0;
  const totalAmountEarned = 0;
  const user = {
    avatarUrl: `https://picsum.photos/seed/avatar1/40/40`,
    name: 'Guest User',
    dateJoined: new Date().toISOString(),
    rewardsPeakId: 'RP-GUEST-001',
    email: 'guest@example.com'
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Peak Profile"
        description="Manage your account and notification settings."
      />

        <Card>
            <CardContent className="p-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Upload Picture</Button>
                        <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 5MB.</p>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <StatItem
                            title="Offers Completed"
                            value={completedOffersCount}
                            icon={CheckCircle}
                            className="bg-muted p-4 rounded-lg"
                        />
                        <StatItem
                            title="Amount Earned"
                            value={`$${totalAmountEarned.toFixed(2)}`}
                            icon={DollarSign}
                            className="bg-muted p-4 rounded-lg"
                        />
                        <StatItem
                            title="Date Joined"
                            value={new Date(user.dateJoined).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                            icon={CalendarDays}
                            className="bg-muted p-4 rounded-lg"
                        />
                        <StatItem
                            title="Rewards Peak ID"
                            value={user.rewardsPeakId}
                            icon={Fingerprint}
                            className="bg-muted p-4 rounded-lg"
                        />
                    </div>
                 </div>
            </CardContent>
        </Card>


      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                This is how others will see you on the site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Update your password here. For security, we'll ask you to confirm your current password.
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
               <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input id="confirm_password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
