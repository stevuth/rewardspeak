import { PlaceHolderImages } from "./placeholder-images";
import {
  Gem,
  Swords,
  Shield,
  Star,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

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
  status?: "Completed" | "Pending" | "Rejected";
  date?: string;
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
    status: "Completed",
    date: "2024-07-20",
  },
  {
    id: "2",
    title: 'Play "Lords Mobile" and Reach Level 10',
    partner: "OfferToro",
    points: 8500,
    imageUrl: getPlaceholder("offertoro-logo").url,
    imageHint: getPlaceholder("offertoro-logo").hint,
    category: "Game",
    status: "Pending",
    date: "2024-07-19",
  },
  {
    id: "3",
    title: 'Install & Use "FinancePal" App',
    partner: "AdGate",
    points: 3200,
    imageUrl: getPlaceholder("adgate-logo").url,
    imageHint: getPlaceholder("adgate-logo").hint,
    category: "App",
    status: "Completed",
    date: "2024-07-18",
  },
  {
    id: "4",
    title: "Answer a Quick Pop Culture Quiz",
    partner: "TimeWall",
    points: 500,
    imageUrl: getPlaceholder("timewall-logo").url,
    imageHint: getPlaceholder("timewall-logo").hint,
    category: "Quiz",
    status: "Rejected",
    date: "2024-07-17",
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
  name: string;
  min: number;
  fee: number;
};

export const withdrawalMethods: WithdrawalMethod[] = [
  { name: "PayPal", min: 5000, fee: 0.02 },
  { name: "Bitcoin", min: 25000, fee: 1000 },
  { name: "Ethereum", min: 25000, fee: 1500 },
  { name: "Amazon Gift Card", min: 1000, fee: 0 },
  { name: "Steam Gift Card", min: 5000, fee: 0 },
];

export const user = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  avatarUrl: getPlaceholder("user-avatar-1").url,
  avatarHint: getPlaceholder("user-avatar-1").hint,
  totalPoints: 75430,
  dailyEarnings: 1250,
  referralLink: "https://rewardspeak.com/ref/jane123",
  referrals: 12,
  referralEarnings: 6000,
  lastLogin: "2024-07-20", // YYYY-MM-DD
};

export const offerWalls = [
    { name: "AdGate", logo: getPlaceholder("adgate-logo").url, hint: getPlaceholder("adgate-logo").hint, description: "A wide variety of offers." },
    { name: "TimeWall", logo: getPlaceholder("timewall-logo").url, hint: getPlaceholder("timewall-logo").hint, description: "Surveys, tasks, and more." },
    { name: "OfferToro", logo: getPlaceholder("offertoro-logo").url, hint: getPlaceholder("offertoro-logo").hint, description: "High-paying mobile offers." },
    { name: "CPALead", logo: getPlaceholder("cpalead-logo").url, hint: getPlaceholder("cpalead-logo").hint, description: "Daily surveys and app installs." },
];

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  goal: number;
  currentProgress: number;
  reward: number;
  unlocked: boolean;
};

export const achievements: Achievement[] = [
  {
    id: "1",
    name: "First Quest",
    description: "Complete your first offer.",
    icon: Star,
    goal: 1,
    currentProgress: 1,
    reward: 100,
    unlocked: true,
  },
  {
    id: "2",
    name: "Quest Apprentice",
    description: "Complete 10 offers.",
    icon: BookOpen,
    goal: 10,
    currentProgress: 4,
    reward: 500,
    unlocked: false,
  },
  {
    id: "3",
    name: "Guild Recruiter",
    description: "Refer 5 friends.",
    icon: Users,
    goal: 5,
    currentProgress: user.referrals,
    reward: 2500,
    unlocked: user.referrals >= 5,
  },
  {
    id: "4",
    name: "Point Hoarder",
    description: "Earn 10,000 total points.",
    icon: Gem,
    goal: 10000,
    currentProgress: user.totalPoints,
    reward: 1000,
    unlocked: user.totalPoints >= 10000,
  },
  {
    id: "5",
    name: "Survey Master",
    description: "Complete 5 surveys.",
    icon: Shield,
    goal: 5,
    currentProgress: 1,
    reward: 400,
    unlocked: false,
  },
  {
    id: "6",
    name: "Game Champion",
    description: "Complete 3 game offers.",
    icon: Swords,
    goal: 3,
    currentProgress: 1,
    reward: 800,
    unlocked: false,
  },
];
