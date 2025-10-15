
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

export const withdrawalMethods: WithdrawalMethod[] = [
  { name: "PayPal", min: 500, fee: 0.02 },
  { name: "Litecoin", min: 2500, fee: 100 },
  { name: "USD Coin", min: 2500, fee: 150 },
  { name: "Binance Coin", min: 1000, fee: 0 },
  { name: "Bitcoin", min: 2500, fee: 100 },
  { name: "Ethereum", min: 2500, fee: 150 },
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

export const offerWalls = [
    { name: "AdGate", logo: getPlaceholder("adgate-logo").url, hint: getPlaceholder("adgate-logo").hint, description: "A wide variety of offers." },
    { name: "TimeWall", logo: getPlaceholder("timewall-logo").url, hint: getPlaceholder("timewall-logo").hint, description: "Surveys, tasks, and more." },
    { name: "OfferToro", logo: getPlaceholder("offertoro-logo").url, hint: getPlaceholder("offertoro-logo").hint, description: "High-paying mobile offers." },
    { name: "CPALead", logo: getPlaceholder("cpalead-logo").url, hint: getPlaceholder("cpalead-logo").hint, description: "Daily surveys and app installs." },
];
