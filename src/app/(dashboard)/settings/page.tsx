
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
import type { Metadata } from "next";
import { DollarSign, CheckCircle, CalendarDays, Upload, Fingerprint, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatItem } from "@/components/stat-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { AnimatedCounter } from "@/components/animated-counter";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "My Peak Profile",
  description: "Account info, preferences, and personal stats.",
};

export default async function MyPeakProfilePage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profileData = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('id, points')
      .eq('user_id', user.id)
      .single();
    profileData = data;
  }

  const completedOffersCount = 0; // This can be fetched later
  const totalPoints = profileData?.points ?? 0;
  const totalAmountEarned = totalPoints / 1000;
  const dateJoined = user?.created_at ? new Date(user.created_at) : new Date();
  const rewardsPeakId = profileData?.id ? `Rewards Peak ID-${profileData.id}` : 'Rewards Peak ID-GUEST';


  return (
    <div className="space-y-8">
      <PageHeader
        title="My Peak Profile"
        description="Manage your account and notification settings."
      />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <Card className="text-center">
                    <CardContent className="p-6">
                        <Avatar className="h-24 w-24 mb-4 mx-auto border-2 border-primary">
                            <AvatarImage src={"https://picsum.photos/seed/avatar1/96/96"} alt={user?.email || "user"} />
                            <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold">{user?.email?.split('@')[0]}</h3>
                        
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>{rewardsPeakId}</span>
                            <Separator orientation="vertical" className="h-4" />
                            <span>Joined {dateJoined.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                        </div>

                        <div className="flex justify-around my-6 text-center">
                            <div>
                                <p className="text-2xl font-bold"><AnimatedCounter value={completedOffersCount} /></p>
                                <p className="text-xs text-muted-foreground">Offers Done</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">${totalAmountEarned.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">Total Earned</p>
                            </div>
                        </div>

                        <Button className="w-full">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Picture
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
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
                            <Input id="name" defaultValue={user?.email} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={user?.email} />
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
        </div>
    </div>
  );
}


