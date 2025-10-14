import { PlaceHolderImages } from "./placeholder-images";
import {
  Gem,
  Swords,
  Shield,
  Star,
  BookOpen,
  Users,
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
};

export const leaderboardData: LeaderboardUser[] = [];

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

export const achievements: Achievement[] = [];
