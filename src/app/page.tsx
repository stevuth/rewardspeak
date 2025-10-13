import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Gamepad2,
  CheckCircle,
  Gift,
  Users,
  Zap,
  Swords,
  ShieldCheck,
  Star,
  Trophy,
} from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HeroIllustration } from '@/components/illustrations/hero';

export default function Home() {
  const userAvatars = [
    PlaceHolderImages.find((p) => p.id === 'leaderboard-user-1'),
    PlaceHolderImages.find((p) => p.id === 'leaderboard-user-2'),
    PlaceHolderImages.find((p) => p.id === 'leaderboard-user-3'),
    PlaceHolderImages.find((p) => p.id === 'leaderboard-user-4'),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
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
        <section className="relative py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="absolute -z-10 top-0 left-0 h-full w-full bg-background [mask-image:radial-gradient(100%_40%_at_top_center,white,transparent)]"></div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 font-headline">
              The Future of Earning
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
              Earn free crypto & gift cards by playing games and completing
              simple tasks. Cash out to PayPal, Bitcoin, Ethereum, and more.
            </p>
            <Button size="lg" asChild className="shadow-lg shadow-primary/30">
              <Link href="/signup">Start Earning Now</Link>
            </Button>
            <div className="mt-8 flex justify-center items-center gap-4">
              <div className="flex -space-x-4">
                {userAvatars.map(
                  (avatar) =>
                    avatar && (
                      <Image
                        key={avatar.id}
                        src={avatar.imageUrl}
                        alt="User"
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-background"
                        data-ai-hint={avatar.imageHint}
                      />
                    )
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Join <span className="font-bold text-primary">400,000+</span>{' '}
                members today!
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 flex justify-center">
            <HeroIllustration />
        </section>


        <section id="how-it-works" className="py-20 md:py-28 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">
                Your Adventure Starts Here
              </h2>
              <p className="text-muted-foreground mb-12">
                Earning with Rewards Peak is as easy as 1, 2, 3. Follow these
                steps to start your journey.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center p-6 rounded-lg transition-transform hover:scale-105 hover:bg-background">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-headline">
                  1. Sign Up
                </h3>
                <p className="text-muted-foreground">
                  Create your free account in just a few seconds to get started.
                </p>
              </div>
              <div className="flex flex-col items-center p-6 rounded-lg transition-transform hover:scale-105 hover:bg-background">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                  <Swords className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-headline">
                  2. Earn Points
                </h3>
                <p className="text-muted-foreground">
                  Complete surveys, play games, and finish offers from our trusted partners.
                </p>
              </div>
              <div className="flex flex-col items-center p-6 rounded-lg transition-transform hover:scale-105 hover:bg-background">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                  <Gift className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-headline">
                  3. Cash Out
                </h3>
                <p className="text-muted-foreground">
                  Redeem your points for crypto, gift cards, and other awesome prizes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">
                Your Arsenal for Success
              </h2>
              <p className="text-muted-foreground mb-12">
                We provide the power-ups you need to maximize your earnings.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:border-primary transition-colors bg-card">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Zap className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline">Instant Withdrawals</CardTitle>
                </CardHeader>
                <CardContent>
                  Cash out your earnings through PayPal, crypto, and various gift cards.
                </CardContent>
              </Card>
              <Card className="hover:border-primary transition-colors bg-card">
                <CardHeader className="flex flex-row items-center gap-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline">Fast Support</CardTitle>
                </CardHeader>
                <CardContent>
                  Our dedicated support team is here to help you 24/7.
                </CardContent>
              </Card>
               <Card className="hover:border-primary transition-colors bg-card">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Swords className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline">Endless Offers</CardTitle>
                </CardHeader>
                <CardContent>
                   A huge variety of offers from trusted partners, updated daily.
                </CardContent>
              </Card>
               <Card className="hover:border-primary transition-colors bg-card">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Star className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline">Daily Giveaways</CardTitle>
                </CardHeader>
                <CardContent>
                  Enter daily, weekly and monthly giveaways for free points.
                </CardContent>
              </Card>
              <Card className="hover:border-primary transition-colors bg-card">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Trophy className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline">Leaderboard</CardTitle>
                </CardHeader>
                <CardContent>
                  Compete with other users for a spot on the leaderboard and win prizes.
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
            <span className="text-muted-foreground font-headline">
              Rewards Peak
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Rewards Peak. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
