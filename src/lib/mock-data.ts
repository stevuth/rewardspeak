
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

export const leaderboardData: LeaderboardUser[] = [];

export type WithdrawalMethod = {
  name: string;
  min: number;
  fee: number;
};

export const withdrawalMethods: WithdrawalMethod[] = [];

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
  dateJoined: "2024-01-01",
  rewardsPeakId: "RP-GUEST-001",
};

export type Withdrawal = {
  id: string;
  method: string;
  amount: number; // in points
  date: string;
  status: "Completed" | "Pending" | "Failed";
};

export const withdrawalHistory: Withdrawal[] = [];


export const offerWalls: any[] = [];
