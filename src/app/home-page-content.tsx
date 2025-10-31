
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { cn } from '@/lib/utils';
import { AuthForm } from '@/components/auth/auth-form';
import { useSearchParams } from 'next/navigation';
import { showLogoutToast } from '@/lib/reward-toast';
import { PaypalLogo, LitecoinLogo, UsdCoinLogo, BinanceCoinLogo, BitcoinLogo, EthereumLogo } from '@/components/illustrations/crypto-logos';
import { OfferCarousel } from '@/components/offer-carousel';
import { Card } from '@/components/ui/card';
import { ExclusiveOpportunitiesIllustration } from '@/components/illustrations/exclusive-opportunities';
import { createSupabaseBrowserClient } from '@/utils/supabase/client';
import { EarnByGamingIllustration } from '@/components/illustrations/earn-by-gaming';
import { motion } from 'framer-motion';

// const recentCashouts = [
//     { name: "John D.", amount: 25.50, currency: "PayPal", time: "2m ago", icon: PaypalLogo },
//     { name: "Maria S.", amount: 50.00, currency: "Bitcoin", time: "5m ago", icon: BitcoinLogo },
//     { name: "Chen W.", amount: 15.20, currency: "Litecoin", time: "8m ago", icon: LitecoinLogo },
// ];

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
      icon: Users,
      title: "Community of Earners",
      description: "Join thousands of members worldwide who are cashing out real money on a daily basis. With a vibrant community, you're part of a global network of ambitious earners.",
      illustration: <ExclusiveOpportunitiesIllustration />,
    },
    {
      icon: Gift,
      title: "Instant Sign-Up Bonus",
      description: "We get you started on the right foot. New users receive a $1 bonus instantly upon signing up, so you're already earning from the moment you join.",
      illustration: <Gift className="w-24 h-24 text-primary" />,
    },
    {
      icon: UserPlus,
      title: "Lifetime Referral Earnings",
      description: "The earning doesn't stop with you. Invite your friends and earn a percentage of their earnings for life. The more they earn, the more you earn.",
      illustration: <Users className="w-24 h-24 text-primary" />,
    },
    {
      icon: Wallet,
      title: "Withdrawals from just $10.00",
      description: "Access your earnings quickly and securely. With low withdrawal minimums, you can cash out your hard-earned rewards without the long wait.",
      illustration: <Wallet className="w-24 h-24 text-primary" />,
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
      title: "Choose an Offer",
      description: "Sign up for free and browse through hundreds of new offers and surveys daily."
    },
    {
      icon: FileSignature,
      title: "Complete the Task",
      description: "Follow the simple on-screen instructions to complete the task. It's that easy."
    },
    {
      icon: DollarSign,
      title: "Get Paid",
      description: "Redeem your earnings for cash, crypto, or gift cards. Fast and secure payouts."
    }
];

export function HomePageContent() {
  const [featuredOffers, setFeaturedOffers] = React.useState<any[]>([]);
  const [phoneCardOffers, setPhoneCardOffers] = React.useState<any[]>([]);
  const [isClient, setIsClient] = React.useState(false);
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [isSignupOpen, setIsSignupOpen] = React.useState(false);
  
  const searchParams = useSearchParams();

  React.useEffect(() => {
    async function fetchAllOffers() {
      try {
        const supabase = createSupabaseBrowserClient();
        
        const heroOfferNames = [
          "Monopoly Go",
          "TikTok",
          "The Grand Mafia",
          "Alibaba.com",
          "Animals & Coins",
          "Sea Explorer",
        ];
        
        const heroNameFilters = heroOfferNames.map(name => `name.ilike.%${name}%`).join(',');
        
        const { data: heroData, error: heroError } = await supabase
            .from('top_converting_offers')
            .select('*')
            .or(heroNameFilters);

        if (heroError) throw heroError;

        let fetchedHeroOffers: any[] = [];
        if (heroData) {
            fetchedHeroOffers = heroData;
        }

        const uniqueHeroOffers = Array.from(new Map(fetchedHeroOffers.map(offer => [offer.name, offer])).values());
        
        if (uniqueHeroOffers.length > 0) {
            setFeaturedOffers(uniqueHeroOffers);
        } else {
            const { data: topOffers } = await supabase
                .from('top_converting_offers')
                .select('*')
                .order('payout', { ascending: false })
                .limit(10);
            setFeaturedOffers(topOffers || []);
        }

        const phoneOfferNames = [
          "Slot Mate",
          "Casino World",
          "The Grand Mafia",
          "Matching Story"
        ];
        
        const phoneQueries = phoneOfferNames.map(name => `name.ilike.%${name}%`);
        
        const { data: phoneData, error: phoneError } = await supabase
            .from('all_offers')
            .select('*')
            .or(phoneQueries.join(','))
            .limit(4);

        if (phoneError) throw phoneError;

        let fetchedPhoneOffers: any[] = [];
        if (phoneData) {
            fetchedPhoneOffers = phoneData;
        }

        const uniquePhoneOffers = Array.from(new Map(fetchedPhoneOffers.map(offer => [offer.name, offer])).values());
        setPhoneCardOffers(uniquePhoneOffers);

      } catch (error) {
        console.error("Error fetching offers:", error);
        setFeaturedOffers([]);
        setPhoneCardOffers([]);
      }
    }
    fetchAllOffers();
  }, []);

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
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 font-headline"
                >
                    Earn <span className="text-primary">Real Money</span> For Simple Online Tasks
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-lg md:text-xl text-muted-foreground mb-8"
                >
                    Join thousands of users who are getting paid for playing games, completing surveys, and finishing simple tasks.
                    Get a <span className="font-bold text-secondary">$1 bonus</span> just for signing up.
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex justify-center gap-4"
                >
                    <Button size="lg" onClick={() => setIsSignupOpen(true)} className="font-bold">
                        Start Earning Now
                        <DollarSign className="ml-2 h-4 w-4" />
                    </Button>
                </motion.div>
            </div>
            <div className="mt-16">
              <OfferCarousel offers={featuredOffers} />
            </div>
        </section>
        
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-card rounded-2xl p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center overflow-hidden">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                            Get Paid in 3 Easy Steps
                        </h2>
                        <div className="space-y-6">
                            {howItWorksSteps.map((step, i) => (
                                <motion.div 
                                    key={step.title}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.2 }}
                                    className="flex items-start gap-4"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary border-2 border-primary/20 shrink-0 mt-1">
                                        <step.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold font-headline">{step.title}</h3>
                                        <p className="text-muted-foreground text-sm">{step.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <Button variant="link" className="p-0 text-foreground font-bold" onClick={() => setIsSignupOpen(true)}>
                            Sign up to start earning <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-center md:mb-0"
                    >
                         <EarnByGamingIllustration offers={phoneCardOffers} />
                    </motion.div>
                </div>
            </div>
        </section>

        <section className="bg-card/20 py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-headline mb-4">
                        Not your typical <span className="text-primary">rewards platform</span>
                    </h2>
                    <p className="text-muted-foreground">Here’s what makes Rewards Peak different from the rest.</p>
                </div>
                <div className="grid grid-cols-1 gap-y-16">
                    {features.map((feature, index) => (
                        <motion.div 
                            key={feature.title}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                            className="grid md:grid-cols-2 gap-8 md:gap-16 items-center"
                        >
                            <div className={cn("flex justify-center", index % 2 === 1 && "md:order-last")}>
                                <div className="w-48 h-48 flex items-center justify-center bg-card p-8 rounded-2xl shadow-lg">
                                    {feature.illustration}
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold mb-4">
                                    <feature.icon className="w-4 h-4" />
                                    <span>{feature.title}</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold font-headline mb-4">{feature.title}</h3>
                                <p className="text-muted-foreground text-lg">{feature.description}</p>
                            </div>
                        </motion.div>
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
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                <Card className="bg-card/80 backdrop-blur-sm p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 overflow-hidden">
                                            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-card">
                                                <cashout.icon className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <div className="truncate">
                                                <p className="font-bold text-sm truncate">{cashout.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">just cashed out <span className="font-bold text-primary">${cashout.amount.toFixed(2)}</span> via {cashout.currency}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground flex-shrink-0 ml-2">{cashout.time}</p>
                                    </div>
                                </Card>
                            </motion.div>
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
                        <AccordionItem value={`item-${index}`} key={index} className="group">
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

      <footer className="relative bg-card mt-24 pt-24 pb-12 text-center">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
            <svg
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="relative block w-[calc(100%+1.3px)] h-[150px]"
                style={{ filter: 'drop-shadow(0 -5px 5px rgba(0,0,0,0.1))' }}
            >
                <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31.74,904.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className="fill-card"
                ></path>
            </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <Image src="/logo.png?v=7" alt="Rewards Peak Logo" width={50} height={50} />
                <span className="text-2xl font-bold font-headline">Rewards Peak</span>
            </Link>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
                Climb to the top with every reward you earn. Simple tasks, real money.
            </p>
            
            <nav className="flex justify-center gap-4 md:gap-8 my-8">
                <Link href="/earn" className="text-muted-foreground hover:text-primary transition-colors font-semibold">Earn</Link>
                <Link href="/withdraw" className="text-muted-foreground hover:text-primary transition-colors font-semibold">Withdraw</Link>
                <Link href="/leaderboard" className="text-muted-foreground hover:text-primary transition-colors font-semibold">Leaderboard</Link>
                <Link href="/support" className="text-muted-foreground hover:text-primary transition-colors font-semibold">Support</Link>
            </nav>

            <div className="flex justify-center space-x-6 mb-8">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={22} /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={22} /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={22} /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><MessageCircle size={22} /></Link>
            </div>

            <div className="border-t border-border/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Rewards Peak. All rights reserved.</p>
                <div className="flex gap-4">
                    <Link href="/terms-of-the-peak" className="hover:text-primary transition-colors">Terms of Service</Link>
                    <Link href="/privacy-trail" className="hover:text-primary transition-colors">Privacy Policy</Link>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
