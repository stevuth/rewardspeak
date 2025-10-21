
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
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
} from "@/components/ui/dialog";
import {
  Gift,
  Trophy,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  UserPlus,
  Wallet,
  Hand,
  CheckCircle,
  DollarSign,
  LogIn,
  Users,
  FileSignature,
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { cn } from '@/lib/utils';
import { AuthForm } from '@/components/auth/auth-form';
import { useSearchParams } from 'next/navigation';
import { showLogoutToast } from '@/lib/reward-toast';
import { PaypalLogo, LitecoinLogo, UsdCoinLogo, BinanceCoinLogo, BitcoinLogo, EthereumLogo } from '@/components/illustrations/crypto-logos';
import { FeaturedOfferCard } from "@/components/featured-offer-card";
import { motion } from 'framer-motion';

const recentCashouts: any[] = [];

const paymentMethods = [
    { icon: PaypalLogo, name: 'Paypal'},
    { icon: BinanceCoinLogo, name: 'Binance'},
    { icon: UsdCoinLogo, name: 'USD Coin'},
    { icon: LitecoinLogo, name: 'Litecoin'},
    { icon: EthereumLogo, name: 'Ethereum'},
    { icon: BitcoinLogo, name: 'Bitcoin'},
];

const features = [
    {
      illustration: <Trophy className="w-12 h-12 text-primary" />,
      title: "Exclusive opportunities",
      description: "More earning options than any other platform, available to all users worldwide.",
    },
    {
      illustration: <Gift className="w-12 h-12 text-primary" />,
      title: "Instant sign up bonus",
      description: "New users receive a $1 bonus instantly upon signing up.",
    },
    {
      illustration: <Users className="w-12 h-12 text-primary" />,
      title: "Lifetime referral earnings",
      description: "Earn a percentage of your referrals' earnings for life.",
    },
    {
      illustration: <Wallet className="w-12 h-12 text-primary" />,
      title: "Withdrawals starting at $10.00",
      description: "Cash out your earnings quickly and securely.",
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
];

const howItWorksSteps = [
    {
      icon: Hand,
      title: "1. Choose an Offer",
      description: "Sign up for free and browse through hundreds of new offers and surveys daily."
    },
    {
      icon: FileSignature,
      title: "2. Complete the Task",
      description: "Follow the simple on-screen instructions to complete the task. It's that easy."
    },
    {
      icon: DollarSign,
      title: "3. Get Paid",
      description: "Redeem your earnings for cash, crypto, or gift cards. Fast and secure payouts."
    }
];

export function HomePageContent({ featuredOffers }: { featuredOffers: any[] }) {
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

  const onSwitchForms = () => {
    setIsLoginOpen(!isLoginOpen);
    setIsSignupOpen(!isSignupOpen);
  };

  const PaymentMethodsMarquee = () => (
    <div className="relative w-full overflow-hidden bg-background py-8">
        <div className="absolute inset-0 z-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent"></div>
        <div className="flex animate-scroll">
            {[...paymentMethods, ...paymentMethods].map((method, index) => (
                <div key={index} className="flex-shrink-0 w-48 flex justify-center items-center gap-4 mx-4">
                    <method.icon className="w-8 h-8 text-muted-foreground" />
                    <span className="text-muted-foreground font-semibold text-lg">{method.name}</span>
                </div>
            ))}
        </div>
        <style jsx>{`
            .bg-grid-pattern {
                background-image: linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)) 1px, hsl(var(--background)) 1px);
                background-size: 2rem 2rem;
            }
            @keyframes scroll {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
            }
            .animate-scroll {
                animation: scroll 20s linear infinite;
            }
        `}</style>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="p-0 border-0 bg-transparent shadow-none">
            <DialogTitle className="sr-only">Log In</DialogTitle>
            <AuthForm type="login" onSwitch={onSwitchForms} />
        </DialogContent>
      </Dialog>
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="p-0 border-0 bg-transparent shadow-none">
            <DialogTitle className="sr-only">Sign Up</DialogTitle>
            <AuthForm type="signup" onSwitch={onSwitchForms} />
        </DialogContent>
      </Dialog>
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png?v=7" alt="Rewards Peak Logo" width={60} height={60} />
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setIsLoginOpen(true)}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
          </Button>
          <Button onClick={() => setIsSignupOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4"/>
                Sign Up & Claim $1
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 font-headline">
                    Earn <span className="text-primary">Real Money</span> For Simple Online Tasks
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                    Join thousands of users who are getting paid for playing games, completing surveys, and finishing simple tasks.
                    Get a <span className="font-bold text-secondary">$1 bonus</span> just for signing up.
                </p>
                <div className="flex justify-center gap-4">
                    <Button size="lg" onClick={() => setIsSignupOpen(true)} className="font-bold">
                        Start Earning Now
                        <DollarSign className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
             <div className="mt-16 relative flex justify-center items-center h-80">
                {featuredOffers.map((offer, index) => (
                    <motion.div
                        key={offer.offer_id}
                        className="absolute origin-bottom-center"
                        style={{ transformOrigin: '50% 150%' }}
                        animate={{
                            y: [Math.sin(index * 0.5) * 10, Math.sin(index * 0.5 + 3.14) * 10, Math.sin(index * 0.5) * 10],
                            rotate: (index - (featuredOffers.length -1) / 2) * 8
                        }}
                        transition={{
                            duration: 5 + index * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.2
                        }}
                    >
                        <FeaturedOfferCard offer={offer} />
                    </motion.div>
                ))}
            </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold font-headline mb-4">Get paid in <span className="text-secondary">3 easy steps</span></h2>
                <p className="text-muted-foreground mb-12">
                    Join thousands of users earning real rewards every day. Getting started is quick and completely free!
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorksSteps.map((step) => (
                <Card key={step.title} className="animated-border-card text-center p-8 transition-all hover:shadow-lg hover:-translate-y-1 bg-card">
                    <div className="mb-4 inline-block p-4 bg-primary/10 rounded-xl">
                        <step.icon className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold font-headline mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                </Card>
              ))}
            </div>
        </section>

        <section className="bg-card/20 py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline mb-2">
                        Not your typical rewards platform. <span className="text-primary">Here's the difference</span>
                    </h2>
                    <p className="text-muted-foreground mb-12">We focus on transparency, high payouts, and a world-class user experience.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 items-center">
                    {features.map((feature, index) => (
                        <div
                        key={feature.title}
                        className={cn(
                            "flex gap-6 items-center",
                            index % 2 === 1 ? "md:flex-row-reverse" : ""
                        )}
                        >
                        <div className="p-4 bg-card rounded-2xl border border-border w-fit shrink-0">
                            {feature.illustration}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold font-headline mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
        <PaymentMethodsMarquee />

        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline mb-2">What are you waiting for?</h2>
                    <p className="text-muted-foreground mb-6">Join the people getting paid right now!</p>
                    <Button size="lg" onClick={() => setIsSignupOpen(true)}>Start earning now</Button>
                </div>
                <div className="space-y-4">
                    {recentCashouts.length > 0 ? (
                        recentCashouts.map((cashout, index) => (
                            <Card key={index} className="bg-card/80 backdrop-blur-sm p-4">
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
                        <Card className="bg-card/80 backdrop-blur-sm p-8 text-center border-dashed">
                            <p className="text-muted-foreground">The community feed is buzzing! <br/> Sign up to see live earnings.</p>
                        </Card>
                    )}
                </div>
            </div>
        </section>
        
        <section className="bg-card/20 py-16 md:py-24">
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
                    <ul className="space-y-2 text-muted-foreground font-bold">
                        <li><Link href="/climb-and-earn" className="hover:text-primary">Earn</Link></li>
                        <li><Link href="/cash-out-cabin" className="hover:text-primary">Withdraw</Link></li>
                        <li><Link href="/top-climbers" className="hover:text-primary">Leaderboard</Link></li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-bold text-lg mb-4">About</h3>
                    <ul className="space-y-2 text-muted-foreground font-bold">
                        <li><Link href="/privacy-trail" className="hover:text-primary">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-primary">Cookie Policy</Link></li>
                        <li><Link href="/terms-of-the-peak" className="hover:text-primary">Terms of Service</Link></li>
                        <li><Link href="/about-rewards-peak" className="hover:text-primary">About Us</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">Support</h3>
                     <ul className="space-y-2 text-muted-foreground font-bold">
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
