

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
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Gamepad2,
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
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  UserPlus,
  ListChecks,
  Wallet,
  Hand,
  CheckCircle,
  Circle,
  Badge,
  CreditCard,
  DollarSign,
  LogOut,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { popularOffers, type Offer } from '@/lib/mock-data';
import { Chrome } from "lucide-react";
import { ExclusiveOpportunitiesIllustration } from "@/components/illustrations/exclusive-opportunities";
import React from 'react';
import { cn } from '@/lib/utils';
import Autoplay from "embla-carousel-autoplay"
import { OfferGridCard } from '@/components/offer-grid-card';
import { PaypalLogo, LitecoinLogo, UsdCoinLogo, BinanceCoinLogo, BitcoinLogo, EthereumLogo } from '@/components/illustrations/crypto-logos';
import { AuthForm } from '@/components/auth/auth-form';
import { useSearchParams } from 'next/navigation';
import { showLogoutToast } from '@/lib/reward-toast';


const recentCashouts: any[] = [];


function OfferCarouselCard({ offer }: { offer: Offer }) {
  return (
    <Card className="overflow-hidden bg-card/80 backdrop-blur-sm w-full">
    <CardContent className="p-4">
        <div className="flex items-center gap-4">
            {offer.imageUrl && (
                <Image
                    src={offer.imageUrl}
                    alt={`${offer.partner} logo`}
                    width={48}
                    height={48}
                    className="rounded-lg"
                    data-ai-hint={offer.imageHint}
                />
            )}
            <div>
                <p className="font-semibold text-sm">{offer.title}</p>
                <div className="flex items-center gap-1 text-secondary mt-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold">5.0</span>
                </div>
            </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
            <p className="text-lg font-bold text-primary">${(offer.points / 100).toFixed(2)}</p>
        </div>
    </CardContent>
    </Card>
  )
}

const paymentMethods = [
    { icon: PaypalLogo, name: 'Paypal'},
    { icon: CreditCard, name: 'Visa'},
    { icon: BinanceCoinLogo, name: 'Binance'},
    { icon: UsdCoinLogo, name: 'USD Coin'},
    { icon: LitecoinLogo, name: 'Litecoin'},
    { icon: EthereumLogo, name: 'Ethereum'},
    { icon: BitcoinLogo, name: 'Bitcoin'},
];

const SignUpBonusIllustration = () => (
    <div className="relative w-48 h-32 flex items-center justify-center">
      {/* Gift Box */}
      <div className="relative">
        <div className="w-24 h-20 bg-primary/20 rounded-lg shadow-lg"></div>
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-primary/30 rounded-t-lg"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-full bg-primary/10"></div>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary/40 rounded-full"></div>
      </div>
      {/* Coins */}
      <div className="absolute top-4 left-8 w-6 h-6 bg-secondary rounded-full animate-bounce"></div>
      <div className="absolute top-10 right-6 w-8 h-8 bg-secondary/80 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
       <div className="absolute bottom-4 left-12 w-5 h-5 bg-secondary/60 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
    </div>
  );

const ReferralEarningsIllustration = () => (
  <div className="relative w-48 h-32 flex items-center justify-center">
    {/* People */}
    <div className="absolute w-10 h-10 bg-secondary/30 rounded-full top-8 left-8"></div>
    <div className="absolute w-12 h-12 bg-muted rounded-full top-4 left-1/2 -translate-x-1/2"></div>
    <div className="absolute w-10 h-10 bg-secondary/30 rounded-full top-8 right-8"></div>
    {/* Arrows and Percentage */}
    <div className="absolute top-20 left-12 text-primary font-bold text-lg">10%</div>
    <ArrowRight className="absolute top-16 left-20 w-8 h-8 text-primary" />
    <ArrowLeft className="absolute top-16 right-20 w-8 h-8 text-primary" />
  </div>
);

const SecureWithdrawalsIllustration = () => (
  <div className="relative w-48 h-32 flex items-center justify-center">
    {/* Banknote */}
    <div className="w-24 h-14 bg-green-500 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-xl">$10</div>
    {/* Padlock */}
    <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
      <ShieldCheck className="w-5 h-5 text-white" />
    </div>
    {/* Coins */}
    <div className="absolute bottom-4 -left-4 w-6 h-6 bg-secondary rounded-full"></div>
    <div className="absolute -bottom-2 left-0 w-8 h-8 bg-secondary/80 rounded-full"></div>
  </div>
);

const FrequentGiveawaysIllustration = () => (
  <div className="relative w-48 h-32 flex items-center justify-center">
    <Gift className="w-20 h-20 text-primary" />
    {/* Stars */}
    <Star className="absolute top-4 left-8 w-5 h-5 text-secondary fill-secondary" />
    <Star className="absolute top-8 right-4 w-6 h-6 text-secondary fill-secondary" />
    <Star className="absolute bottom-4 left-12 w-4 h-4 text-secondary fill-secondary" />
  </div>
);


function HomePageContent() {
  const featuredOffers = popularOffers.slice(0, 5);
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [isClient, setIsClient] = React.useState(false);
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [isSignupOpen, setIsSignupOpen] = React.useState(false);
  
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const event = searchParams.get('event');
    const userEmail = searchParams.get('user_email');
    
    if (event === 'logout') {
      showLogoutToast(userEmail);
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams]);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (!api) {
      return
    }
 
    setCurrent(api.selectedScrollSnap())
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])


  const features = [
    {
      illustration: <ReferralEarningsIllustration />,
      title: "10% lifetime referral earnings",
      description: "Earn 10% of your referrals' earnings for life.",
    },
    {
      illustration: <SecureWithdrawalsIllustration />,
      title: "Withdrawals starting at $10.00",
      description: "Cash out your earnings quickly and securely.",
    },
    {
      illustration: <FrequentGiveawaysIllustration />,
      title: "Frequent giveaways",
      description: "Participate in regular giveaways for extra rewards.",
    },
  ];

  const faqs = [
    {
      question: "How much can I earn?",
      answer: "Your earnings depend on the tasks you complete. The more offers you do, the more you can earn. There's no limit!"
    },
    {
      question: "How do I get paid?",
      answer: "You can withdraw your earnings via PayPal, various cryptocurrencies like Bitcoin and Litecoin, and more. Payouts are fast and secure."
    },
    {
        question: "Is Rewards Peak free to use?",
        answer: "Yes, Rewards Peak is completely free. You'll never be asked to pay for anything. Just sign up and start earning."
    }
  ]

  const offerSteps = [
    { reward: '$0.03', task: 'Upgrade to 100 meter', status: 'completed' },
    { reward: '$0.13', task: 'Upgrade to 300 meter', status: 'completed' },
    { reward: '$1.29', task: 'Upgrade to 700 meter', status: 'completed' },
    { reward: '$6.43', task: 'Upgrade to 900 meter', status: 'current' },
    { reward: '$17.16', task: 'Upgrade to 1000 meter', status: 'pending' },
    { reward: '$60.06', task: 'Upgrade to 2000 meter', status: 'pending' },
    { reward: '$171.60', task: 'Upgrade to 3000 meter', status: 'pending' },
  ];

  const onSwitchForms = () => {
    setIsLoginOpen(!isLoginOpen);
    setIsSignupOpen(!isSignupOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="p-0 border-0 max-w-md">
            <DialogTitle className="sr-only">Log In</DialogTitle>
            <AuthForm type="login" onSwitch={onSwitchForms} />
        </DialogContent>
      </Dialog>
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="p-0 border-0 max-w-md">
            <DialogTitle className="sr-only">Sign Up</DialogTitle>
            <AuthForm type="signup" onSwitch={onSwitchForms} />
        </DialogContent>
      </Dialog>
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png?v=4" alt="Rewards Peak Logo" width={40} height={40} />
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsLoginOpen(true)}>
              <Chrome className="mr-2 h-4 w-4" />
              Sign in
          </Button>
          <Button onClick={() => setIsSignupOpen(true)}>
                <Users className="mr-2 h-4 w-4"/>
                Sign Up
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
              
             {featuredOffers.length > 0 && (
                <div className="mt-8 md:mt-12 h-48 md:h-64 flex items-center justify-center">
                    <Carousel
                        setApi={setApi}
                        plugins={[
                          Autoplay({
                            delay: 2000,
                            stopOnInteraction: true,
                          }),
                        ]}
                        opts={{
                          align: "center",
                          loop: true,
                        }}
                        className="w-full max-w-xs sm:max-w-sm"
                    >
                        <CarouselContent>
                        {featuredOffers.map((offer, index) => {
                           const isFeatured = index === current;
                           let rotation = 0;
                           let translation = 0;
                           
                           if (index < current) {
                             rotation = -15 - (current - index -1) * 5;
                             translation = -40 - (current - index-1) * 10;
                           }
                           if (index > current) {
                             rotation = 15 + (index - current -1) * 5;
                             translation = 40 + (index - current-1) * 10;
                           }
                           
                           return (
                            <CarouselItem key={index} className="basis-1/2 flex justify-center">
                                <div 
                                  className={cn("transition-all duration-300", isFeatured ? 'scale-100 opacity-100' : 'scale-90 opacity-60')}
                                  style={{
                                    transform: `rotate(${rotation}deg) translateX(${translation}%)`,
                                  }}
                                >
                                  <OfferCarouselCard offer={offer} />
                                </div>
                            </CarouselItem>
                           )
                        })}
                        </CarouselContent>
                        <CarouselPrevious className="text-foreground hover:text-primary disabled:opacity-50 -left-4 hidden sm:flex" />
                        <CarouselNext className="text-foreground hover:text-primary disabled:opacity-50 -right-4 hidden sm:flex" />
                    </Carousel>
                </div>
             )}
            </div>

            {/* Right Column */}
            <div className="mt-8 lg:mt-0">
              <Card className="max-w-md mx-auto">
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
                  <Button size="lg" className="w-full font-bold" onClick={() => setIsSignupOpen(true)}>
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

                  <Button variant="outline" className="w-full font-bold" onClick={() => setIsSignupOpen(true)}>
                    <Chrome className="mr-2 h-4 w-4" />
                    Sign up with Google
                  </Button>
                  <Button variant="outline" className="w-full font-bold bg-[#6441a5]/20 border-[#6441a5]/50 hover:bg-[#6441a5]/30 text-white" onClick={() => setIsSignupOpen(true)}>
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

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl md:text-5xl font-bold font-headline mb-4">Get paid in <span className="text-secondary">3 easy steps</span></h2>
                    <p className="text-muted-foreground mb-6">
                        Join thousands of users earning real rewards every day. Getting started is quick and completely free!
                    </p>
                    <Button asChild size="lg">
                        <Link href="/signup">Start Earning</Link>
                    </Button>
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <p className="text-sm text-muted-foreground">Trusted by over +1500</p>
                        <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-green-500 fill-green-500" />
                            <p className="font-bold">Trustpilot</p>
                            <div className="flex items-center bg-green-500 text-white px-2 py-1 rounded-md">
                                <Star className="w-4 h-4 fill-white" />
                                <Star className="w-4 h-4 fill-white" />
                                <Star className="w-4 h-4 fill-white" />
                                <Star className="w-4 h-4 fill-white" />
                                <Star className="w-4 h-4 fill-white" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                  <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <Hand className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                              <h3 className="font-bold font-headline">1. Choose an offer</h3>
                              <p className="text-sm text-muted-foreground">Browse our selection of offers, surveys, and tasks.</p>
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          {popularOffers.slice(0, 4).map((offer) => (
                              <OfferGridCard key={offer.id} offer={offer} />
                          ))}
                      </div>
                  </Card>
                   <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</div>
                        </div>
                        <div>
                          <h3 className="font-bold font-headline">2. Complete the offer</h3>
                          <p className="text-sm text-muted-foreground">Follow the steps to complete the offer and get paid.</p>
                        </div>
                      </div>
                      <Card className="bg-background/50 p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <Image src="https://picsum.photos/seed/riverrush/48/48" alt="River Rush" width={48} height={48} className="rounded-lg" data-ai-hint="beaver character"/>
                            <div>
                                <h4 className="font-semibold">River Rush</h4>
                                <div className="text-xs bg-primary/20 text-primary-foreground px-2 py-0.5 rounded-full inline-block">Game</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {offerSteps.map((step, index) => (
                                <div
                                key={index}
                                className={cn(
                                    "flex items-center gap-3 text-sm p-2 rounded-md",
                                    step.status === 'completed' && 'bg-green-500/10 text-green-400',
                                    step.status === 'current' && 'bg-primary/20 ring-2 ring-primary',
                                    step.status === 'pending' && 'text-muted-foreground'
                                )}
                                >
                                {step.status === 'completed' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Circle className={cn("w-4 h-4", step.status === 'current' ? 'text-primary' : 'text-muted-foreground/50')} />}
                                <span className="font-bold">{step.reward}</span>
                                <span>{step.task}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center text-sm pt-2 border-t border-border">
                            <p>Progress: <span className="font-bold">3/7</span></p>
                            <p className="font-bold text-accent">$256.70</p>
                        </div>
                      </Card>
                  </Card>
                  <Card className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <DollarSign className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold font-headline">3. Get Paid</h3>
                                <p className="text-sm text-muted-foreground">Redeem your earnings for cash, crypto, or gift cards.</p>
                            </div>
                        </div>
                        <div className="relative flex items-center justify-center h-48 md:h-64">
                            <div className="absolute w-48 h-48 md:w-64 md:h-64 border-2 border-dashed border-border rounded-full"></div>
                            <div className="absolute w-36 h-36 md:w-48 md:h-48 border border-border rounded-full"></div>
                            
                            {isClient && paymentMethods.map((method, i) => {
                                const angle = (i / paymentMethods.length) * 2 * Math.PI;
                                const radius = window.innerWidth < 768 ? 96 : 128;
                                const x = Math.cos(angle) * radius;
                                const y = Math.sin(angle) * radius;
                                return (
                                    <div
                                        key={method.name}
                                        className="absolute w-10 h-10 md:w-12 md:h-12 bg-card border border-border rounded-full flex items-center justify-center"
                                        style={{ 
                                            transform: `translate(${x}px, ${y}px)`
                                        }}
                                    >
                                        <method.icon className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
                                    </div>
                                )
                            })}

                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Available to withdraw</p>
                                <p className="text-3xl md:text-4xl font-bold text-accent my-1">$170.00</p>
                                <Button variant="link" className="text-primary">Choose your reward</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-2">
                Not your typical rewards platform. <span className="text-primary">Here's the difference</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                <Card className="p-6 flex flex-col items-center text-center bg-card/50">
                    <ExclusiveOpportunitiesIllustration />
                    <h3 className="font-bold text-lg mt-4 mb-2 font-headline">Exclusive opportunities</h3>
                    <p className="text-sm text-muted-foreground">More earning options than any other platform, available to all users worldwide.</p>
                </Card>
                <Card className="p-6 flex flex-col items-center justify-center text-center bg-card/50">
                    <SignUpBonusIllustration />
                    <h3 className="font-bold text-lg font-headline mb-2 mt-4">Instant sign up bonus</h3>
                    <p className="text-sm text-muted-foreground">New users receive a $1 bonus instantly upon signing up.</p>
                </Card>
                {features.map((feature, index) => (
                    <Card key={index} className="p-6 flex flex-col items-center justify-center text-center bg-card/50">
                        {feature.illustration}
                        <h3 className="font-bold text-lg font-headline mb-2 mt-4">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </Card>
                ))}
            </div>
        </section>

        <section className="bg-card/40 py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline mb-2">What are you waiting for?</h2>
                    <p className="text-muted-foreground mb-6">Join the people getting paid right now!</p>
                    <Button size="lg" asChild>
                        <Link href="/signup">Start earning now</Link>
                    </Button>
                </div>
                <div className="space-y-4">
                    {recentCashouts.length > 0 ? (
                        recentCashouts.map((cashout, index) => (
                            <Card key={index} className="bg-background/50 backdrop-blur-sm p-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 overflow-hidden">
                                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-card">
                                            {/* cashout.icon */}
                                        </div>
                                        <div className="truncate">
                                            <p className="font-bold text-sm truncate">{cashout.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">just cashed out <span className="font-bold text-primary">${cashout.amount.toFixed(2)}</span> via {cashout.currency}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground flex-shrink-0 ml-2">{cashout.time}</p>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="bg-background/50 backdrop-blur-sm p-4 text-center">
                            <p className="text-muted-foreground">Be the first to cash out!</p>
                        </Card>
                    )}
                </div>
            </div>
        </section>

        <section className="bg-card/40 py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline mb-2">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        Have questions? We've got answers.
                    </p>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent>
                            {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>

      </main>

      <footer className="bg-card/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="font-bold text-lg mb-4">Browse</h3>
                    <ul className="space-y-2 text-muted-foreground">
                        <li><Link href="/climb-and-earn" className="hover:text-primary">Earn</Link></li>
                        <li><Link href="/cash-out-cabin" className="hover:text-primary">Withdraw</Link></li>
                        <li><Link href="/top-climbers" className="hover:text-primary">Leaderboard</Link></li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-bold text-lg mb-4">About</h3>
                    <ul className="space-y-2 text-muted-foreground">
                        <li><Link href="/privacy-trail" className="hover:text-primary">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-primary">Cookie Policy</Link></li>
                        <li><Link href="/terms-of-the-peak" className="hover:text-primary">Terms of Service</Link></li>
                        <li><Link href="/about-rewards-peak" className="hover:text-primary">About Us</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">Support</h3>
                     <ul className="space-y-2 text-muted-foreground">
                        <li><Link href="/help-station" className="hover:text-primary">Help Center</Link></li>
                        <li><Link href="#" className="hover:text-primary">Contact Us</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">Community</h3>
                    <div className="flex space-x-4">
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram /></Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter /></Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary"><MessageCircle /></Link>
                    </div>
                </div>
            </div>
            <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                <p>&copy; 2024 Rewards Peak. All rights reserved.</p>
                 <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <Link href="/privacy-trail" className="hover:text-primary">Privacy Policy</Link>
                    <Link href="/terms-of-the-peak" className="hover:text-primary">Terms of Service</Link>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </React.Suspense>
  )
}
