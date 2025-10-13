import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, CheckCircle, Gift, Users, Zap, Swords } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Gamepad2 className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold font-headline">Rewards Peak</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-primary/10 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="absolute inset-0 -z-10 h-full w-full bg-background [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"></div>
            <Swords className="mx-auto h-20 w-20 text-primary animate-pulse mb-6" />
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 font-headline">
              Level Up Your Earnings
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
              Welcome to Rewards Peak, the ultimate game where your skills are transformed into epic rewards. Complete quests, conquer challenges, and watch your earnings soar.
            </p>
            <Button size="lg" asChild className="shadow-lg shadow-primary/30">
              <Link href="/signup">Start Your Quest</Link>
            </Button>
          </div>
        </section>

        <section id="how-it-works" className="py-20 md:py-28 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">Your Adventure Starts Here</h2>
              <p className="text-muted-foreground mb-12">
                Earning with Rewards Peak is as easy as 1, 2, 3. Follow these steps to start your journey.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center p-6 rounded-lg transition-transform hover:scale-105 hover:bg-background">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-headline">1. Accept a Quest</h3>
                <p className="text-muted-foreground">
                  Browse our board of quests from trusted partners. Choose tasks that suit your playstyle.
                </p>
              </div>
              <div className="flex flex-col items-center p-6 rounded-lg transition-transform hover:scale-105 hover:bg-background">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-headline">2. Conquer It</h3>
                <p className="text-muted-foreground">
                  Follow the objectives to complete the quest or challenge. Each completion brings you closer to rewards.
                </p>
              </div>
              <div className="flex flex-col items-center p-6 rounded-lg transition-transform hover:scale-105 hover:bg-background">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                  <Gift className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-headline">3. Claim Your Loot</h3>
                <p className="text-muted-foreground">
                  Your points are instantly added to your treasury upon completion. Withdraw them anytime.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">Your Arsenal for Success</h2>
              <p className="text-muted-foreground mb-12">
                We provide the power-ups you need to maximize your earnings.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:border-primary transition-colors bg-card">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Gift className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline">Diverse Quests</CardTitle>
                </CardHeader>
                <CardContent>
                  From surveys to app downloads, find quests that match your playstyle.
                </CardContent>
              </Card>
              <Card className="hover:border-primary transition-colors bg-card">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Zap className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline">Instant Payouts</CardTitle>
                </CardHeader>
                <CardContent>
                  Cash out your earnings through PayPal, crypto, and various gift cards.
                </CardContent>
              </Card>
              <Card className="hover:border-primary transition-colors bg-card">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Users className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline">Guild Program</CardTitle>
                </CardHeader>
                <CardContent>
                  Earn even more by inviting your friends to join your guild.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-muted-foreground" />
            <span className="text-muted-foreground font-headline">Rewards Peak</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Rewards Peak. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
