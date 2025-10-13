import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mountain, CheckCircle, Gift, Users, Zap, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Mountain className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">Rewards Peak</span>
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
            <Award className="mx-auto h-16 w-16 text-primary mb-6" />
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
              Climb to New Heights of Earning
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
              Welcome to Rewards Peak, where your time and effort are transformed into tangible rewards. Complete tasks, take surveys, and watch your earnings grow.
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">Start Earning Now</Link>
            </Button>
          </div>
        </section>

        <section id="how-it-works" className="py-20 md:py-28 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground mb-12">
                Earning with Rewards Peak is as simple as 1, 2, 3.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Choose a Task</h3>
                <p className="text-muted-foreground">
                  Browse our extensive list of offers from trusted partners.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Complete It</h3>
                <p className="text-muted-foreground">
                  Follow the instructions to complete the task or survey.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                  <Gift className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Get Rewarded</h3>
                <p className="text-muted-foreground">
                  Your points are added to your account instantly upon completion.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Features to Help You Succeed</h2>
              <p className="text-muted-foreground mb-12">
                We provide the tools you need to maximize your earnings.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Gift className="h-8 w-8 text-primary" />
                  <CardTitle>Diverse Offers</CardTitle>
                </CardHeader>
                <CardContent>
                  From surveys to app downloads, find tasks that fit your interests.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Zap className="h-8 w-8 text-primary" />
                  <CardTitle>Quick Payouts</CardTitle>
                </CardHeader>
                <CardContent>
                  Withdraw your earnings through PayPal or cryptocurrency.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Users className="h-8 w-8 text-primary" />
                  <CardTitle>Referral Program</CardTitle>
                </CardHeader>
                <CardContent>
                  Earn even more by inviting your friends to join Rewards Peak.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Mountain className="h-6 w-6 text-muted-foreground" />
            <span className="text-muted-foreground">Rewards Peak</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Rewards Peak. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
