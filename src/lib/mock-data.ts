import { PlaceHolderImages } from "./placeholder-images";

const getPlaceholder = (id: string) => {
  const placeholder = PlaceHolderImages.find((p) => p.id === id);
  return {
    url: placeholder?.imageUrl || `https://picsum.photos/seed/${id}/64/64`,
    hint: placeholder?.imageHint || "placeholder",
  };
};

export type Offer = {
  id: string;
  title: string;
  partner: string;
  points: number;
  imageUrl: string;
  imageHint: string;
  category: "Survey" | "Game" | "App" | "Quiz";
};

export const popularOffers: Offer[] = [
  {
    id: "1",
    title: 'Complete a Survey on Daily Habits',
    partner: "CPALead",
    points: 1250,
    imageUrl: getPlaceholder("cpalead-logo").url,
    imageHint: getPlaceholder("cpalead-logo").hint,
    category: "Survey",
  },
  {
    id: "2",
    title: 'Play "Lords Mobile" and Reach Level 10',
    partner: "OfferToro",
    points: 8500,
    imageUrl: getPlaceholder("offertoro-logo").url,
    imageHint: getPlaceholder("offertoro-logo").hint,
    category: "Game",
  },
  {
    id: "3",
    title: 'Install & Use "FinancePal" App',
    partner: "AdGate",
    points: 3200,
    imageUrl: getPlaceholder("adgate-logo").url,
    imageHint: getPlaceholder("adgate-logo").hint,
    category: "App",
  },
  {
    id: "4",
    title: "Answer a Quick Pop Culture Quiz",
    partner: "TimeWall",
    points: 500,
    imageUrl: getPlaceholder("timewall-logo").url,
    imageHint: getPlaceholder("timewall-logo").hint,
    category: "Quiz",
  },
];

export const quickTasks: Offer[] = [
    ...popularOffers.slice(0, 2),
    {
        id: "5",
        title: "Watch a Short Video Ad",
        partner: "AdGate",
        points: 150,
        imageUrl: getPlaceholder("adgate-logo").url,
        imageHint: getPlaceholder("adgate-logo").hint,
        category: "App",
    },
];

export type LeaderboardUser = {
  rank: number;
  name: string;
  points: number;
  avatarUrl: string;
  avatarHint: string;
};

export const leaderboardData: LeaderboardUser[] = [
  {
    rank: 1,
    name: "Alex T.",
    points: 125800,
    avatarUrl: getPlaceholder("leaderboard-user-1").url,
    avatarHint: getPlaceholder("leaderboard-user-1").hint,
  },
  {
    rank: 2,
    name: "Sarah P.",
    points: 112300,
    avatarUrl: getPlaceholder("leaderboard-user-2").url,
    avatarHint: getPlaceholder("leaderboard-user-2").hint,
  },
  {
    rank: 3,
    name: "Michael B.",
    points: 98500,
    avatarUrl: getPlaceholder("leaderboard-user-3").url,
    avatarHint: getPlaceholder("leaderboard-user-3").hint,
  },
    {
    rank: 4,
    name: "Jessie L.",
    points: 95100,
    avatarUrl: getPlaceholder("leaderboard-user-4").url,
    avatarHint: getPlaceholder("leaderboard-user-4").hint,
  },
  {
    rank: 5,
    name: "David K.",
    points: 89000,
    avatarUrl: getPlaceholder("leaderboard-user-5").url,
    avatarHint: getPlaceholder("leaderboard-user-5").hint,
  },
];

export type WithdrawalMethod = {
    name: "PayPal" | "Bitcoin" | "Ethereum";
    min: number;
    fee: number;
}

export const withdrawalMethods: WithdrawalMethod[] = [
    { name: "PayPal", min: 5000, fee: 0.02 },
    { name: "Bitcoin", min: 25000, fee: 1000 },
    { name: "Ethereum", min: 25000, fee: 1500 },
]

export const user = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    avatarUrl: getPlaceholder("user-avatar-1").url,
    avatarHint: getPlaceholder("user-avatar-1").hint,
    totalPoints: 75430,
    dailyEarnings: 1250,
    referralLink: "https://rewardspeak.com/ref/jane123",
    referrals: 12,
    referralEarnings: 6000
}

export const offerWalls = [
    { name: "AdGate", logo: getPlaceholder("adgate-logo").url, hint: getPlaceholder("adgate-logo").hint, description: "A wide variety of offers." },
    { name: "TimeWall", logo: getPlaceholder("timewall-logo").url, hint: getPlaceholder("timewall-logo").hint, description: "Surveys, tasks, and more." },
    { name: "OfferToro", logo: getPlaceholder("offertoro-logo").url, hint: getPlaceholder("offertoro-logo").hint, description: "High-paying mobile offers." },
    { name: "CPALead", logo: getPlaceholder("cpalead-logo").url, hint: getPlaceholder("cpalead-logo").hint, description: "Daily surveys and app installs." },
]
