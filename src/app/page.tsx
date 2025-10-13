
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Gamepad2,
  CheckCircle,
  Gift,
  Zap,
  Swords,
  ShieldCheck,
  Star,
  Trophy,
  Mail,
  Twitch,
  ArrowLeft,
  ArrowRight,
  Bitcoin,
  Headset,
  Banknote,
  Users,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { popularOffers, type Offer } from '@/lib/mock-data';
import { Chrome } from "lucide-react";
import { ExclusiveOpportunitiesIllustration } from "@/components/illustrations/exclusive-opportunities";
import { DailyChallengesIllustration } from "@/components/illustrations/daily-challenges";


function OfferCarouselCard({ offer, isFeatured }: { offer: Offer, isFeatured?: boolean }) {
  return (
    <div className={`transition-transform duration-300 ${isFeatured ? 'scale-110' : 'scale-90 opacity-60'}`}>
        <Card className="overflow-hidden bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4">
            <div className="flex items-center gap-4">
                <Image
                    src={offer.imageUrl}
                    alt={`${offer.partner} logo`}
                    width={48}
                    height={48}
                    className="rounded-lg"
                    data-ai-hint={offer.imageHint}
                />
                <div>
                    <p className="font-semibold text-sm">{offer.title}</p>
                    <div className="flex items-center gap-1 text-yellow-400 mt-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs font-bold">5.0</span>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <p className="text-lg font-bold text-primary">${(offer.points / 1000).toFixed(2)}</p>
            </div>
        </CardContent>
        </Card>
    </div>
  )
}

export default function Home() {
  const featuredOffers = popularOffers.slice(0, 5);

  const features = [
    {
      icon: Bitcoin,
      title: "Fast payments",
    },
    {
      icon: Headset,
      title: "24/7 Support",
    },
    {
      icon: Banknote,
      title: "Withdrawals starting at $2.00",
    },
    {
      icon: Gift,
      title: "Frequent giveaways",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Gamepad2 className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold font-headline">Rewards Peak</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/login">
              <Chrome className="mr-2 h-4 w-4" />
              Sign in
            </Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
                <Users className="mr-2 h-4 w-4"/>
                Sign Up
            </Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="relative flex flex-col justify-center text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 font-headline">
                Earn <span className="text-primary">real money</span>
                <br />
                by playing games
              </h1>
              
              <div className="mt-12 h-64 flex items-center justify-center">
                 <Carousel
                    opts={{
                      align: "center",
                      loop: true,
                    }}
                    className="w-full max-w-md"
                  >
                    <CarouselContent>
                      {featuredOffers.map((offer, index) => (
                        <CarouselItem key={index} className="basis-1/2 flex justify-center">
                            <OfferCarouselCard offer={offer} isFeatured={index === 1} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                     <CarouselPrevious className="text-foreground hover:text-primary disabled:opacity-50 -left-4" />
                    <CarouselNext className="text-foreground hover:text-primary disabled:opacity-50 -right-4" />
                  </Carousel>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">
                    Get started - it's free!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="email" placeholder="Email address" className="pl-9" />
                  </div>
                  <Button size="lg" className="w-full font-bold">
                    Start Earning
                  </Button>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        or
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full font-bold">
                    <Chrome className="mr-2 h-4 w-4" />
                    Sign up with Google
                  </Button>
                  <Button variant="outline" className="w-full font-bold bg-[#6441a5]/20 border-[#6441a5]/50 hover:bg-[#6441a5]/30 text-white">
                     <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 fill-current"><title>Twitch</title><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0H6zm14.571 11.143-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714v9.429z"/></svg>
                    Sign up with Twitch
                  </Button>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground text-center w-full">
                    By signing up you agree to our Terms of Service and Privacy Policy.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-2">
                Not your typical rewards platform. <span className="text-primary">Here's the difference</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* Large Cards */}
                <Card className="md:col-span-2 lg:col-span-1 p-6 flex flex-col items-center text-center bg-card/50">
                    <ExclusiveOpportunitiesIllustration />
                    <h3 className="font-bold text-lg mt-4 mb-2 font-headline">Exclusive opportunities</h3>
                    <p className="text-sm text-muted-foreground">More earning options than any other platform, available to all users worldwide. Only on Rewardy.</p>
                </Card>
                <Card className="md:col-span-2 lg:col-span-1 p-6 flex flex-col items-center text-center bg-card/50">
                    <DailyChallengesIllustration />
                    <h3 className="font-bold text-lg mt-4 mb-2 font-headline">Daily Challenges</h3>
                    <p className="text-sm text-muted-foreground">Take on daily challenges that reward your consistency and help you earn even more each day.</p>
                </Card>

                {/* Small Cards */}
                <div className="grid grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="p-6 flex flex-col items-center justify-center text-center bg-card/50">
                            <feature.icon className="w-8 h-8 text-primary mb-3" />
                            <h4 className="font-semibold text-sm">{feature.title}</h4>
                        </Card>
                    ))}
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
