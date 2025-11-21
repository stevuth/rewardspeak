
'use client';

import { useState } from "react";
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
import { Globe, CalendarDays, Fingerprint, Settings, ListChecks } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AnimatedCounter } from "@/components/animated-counter";
import { AvatarUploader } from "@/components/avatar-uploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { updatePassword } from "@/app/actions";
import { WavingMascotLoader } from "@/components/waving-mascot-loader";




export function SettingsPageClient({ user, profileData, completedOffersCount }: { user: any, profileData: any, completedOffersCount: number }) {
    const { toast } = useToast();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast({
                variant: 'destructive',
                title: "Passwords Don't Match",
                description: "Whoops! Please ensure both password fields are identical.",
            });
            return;
        }
        if (newPassword.length < 6) {
            toast({
                variant: 'destructive',
                title: 'Password Too Short',
                description: 'For security, your new password must be at least 6 characters long.',
            });
            return;
        }

        setIsSaving(true);
        const result = await updatePassword(newPassword);

        if (result.success) {
            toast({
                title: 'Password Updated',
                description: 'Your password has been changed successfully.',
            });
            setNewPassword('');
            setConfirmPassword('');
        } else {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: result.error || 'An unknown error occurred.',
            });
        }
        setIsSaving(false);
    };

    const totalPoints = profileData?.points ?? 0;
    const totalAmountEarned = totalPoints / 1000;
    const dateJoined = user?.created_at ? new Date(user.created_at) : new Date();
    const rewardsPeakId = profileData?.id ?? 'GUEST';
    const avatarUrl = profileData?.avatar_url;
    const countryCode = profileData?.country_code ?? 'N/A';


    return (
        <div className="space-y-8">
            <PageHeader
                description="Manage your account settings."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card className="text-center">
                        <CardContent className="p-6 space-y-6">
                            <AvatarUploader currentAvatar={avatarUrl} />
                            <div>
                                <h3 className="text-xl font-semibold">{user?.email?.split('@')[0]}</h3>
                                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground mt-2">
                                    <span className="font-mono flex items-center gap-1"><Fingerprint className="h-3 w-3" /> ID-{rewardsPeakId}</span>
                                    <Separator orientation="vertical" className="h-4" />
                                    <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Joined {dateJoined.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                    {countryCode !== 'N/A' && (
                                        <>
                                            <Separator orientation="vertical" className="h-4" />
                                            <span className="flex items-center gap-1">
                                                <Globe className="h-3 w-3" />
                                                <img
                                                    src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
                                                    srcSet={`https://flagcdn.com/w80/${countryCode.toLowerCase()}.png 2x`}
                                                    width="20"
                                                    height="15"
                                                    alt={countryCode}
                                                    className="object-contain"
                                                />
                                                {countryCode}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-around text-center pt-4 border-t border-border">
                                <div>
                                    <p className="text-2xl font-bold"><AnimatedCounter value={completedOffersCount} /></p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center"><ListChecks className="h-3 w-3" /> Offers Done</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">${totalAmountEarned.toFixed(2)}</p>
                                    <p className="text-xs text-muted-foreground">Total Earned</p>
                                </div>
                            </div>
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
                                        Your account details are displayed below.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" defaultValue={user?.email?.split('@')[0]} readOnly disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" defaultValue={user?.email} readOnly disabled />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="password">
                            <form onSubmit={handleUpdatePassword}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Password</CardTitle>
                                        <CardDescription>
                                            Set a new password for your account. It must be at least 6 characters long.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="new_password">New Password</Label>
                                            <Input
                                                id="new_password"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm_password">Confirm New Password</Label>
                                            <Input
                                                id="confirm_password"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button type="submit" disabled={isSaving}>
                                            {isSaving ? (
                                                <WavingMascotLoader messages={["Saving..."]} />
                                            ) : (
                                                'Update Password'
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
