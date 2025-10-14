
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

export const popularOffers: Offer[] = [];

export const quickTasks: Offer[] = [];

export type LeaderboardUser = {
  rank: number;
  name: string;
  points: number;
  avatarUrl: string;
  avatarHint: string;
  prize?: number;
};

export const leaderboardData: LeaderboardUser[] = [
    { rank: 1, name: "elizabeth320", points: 11125, avatarUrl: getPlaceholder("leaderboard-user-1").url, avatarHint: getPlaceholder("leaderboard-user-1").hint, prize: 3000 },
    { rank: 2, name: "dingo0842", points: 8361, avatarUrl: getPlaceholder("leaderboard-user-2").url, avatarHint: getPlaceholder("leaderboard-user-2").hint, prize: 2000 },
    { rank: 3, name: "downxx", points: 6262, avatarUrl: getPlaceholder("leaderboard-user-3").url, avatarHint: getPlaceholder("leaderboard-user-3").hint, prize: 1000 },
    { rank: 4, name: "hermes", points: 5980, avatarUrl: getPlaceholder("leaderboard-user-4").url, avatarHint: getPlaceholder("leaderboard-user-4").hint },
    { rank: 5, name: "ritatuzi", points: 5120, avatarUrl: getPlaceholder("leaderboard-user-5").url, avatarHint: getPlaceholder("leaderboard-user-5").hint },
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
  name: "Guest User",
  email: "guest@example.com",
  avatarUrl: getPlaceholder("user-avatar-1").url,
  avatarHint: getPlaceholder("user-avatar-1").hint,
  totalPoints: 0,
  dailyEarnings: 0,
  referralLink: "https://rewardspeak.com/ref/guest",
  referrals: 0,
  referralEarnings: 0,
  lastLogin: "2024-01-01", // YYYY-MM-DD
};

export const offerWalls = [
    { name: "AdGate", logo: getPlaceholder("adgate-logo").url, hint: getPlaceholder("adgate-logo").hint, description: "A wide variety of offers." },
    { name: "TimeWall", logo: getPlaceholder("timewall-logo").url, hint: getPlaceholder("timewall-logo").hint, description: "Surveys, tasks, and more." },
    { name: "OfferToro", logo: getPlaceholder("offertoro-logo").url, hint: getPlaceholder("offertoro-logo").hint, description: "High-paying mobile offers." },
    { name: "CPALead", logo: getPlaceholder("cpalead-logo").url, hint: getPlaceholder("cpalead-logo").hint, description: "Daily surveys and app installs." },
];
