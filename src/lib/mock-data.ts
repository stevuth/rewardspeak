
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
    { id: "1", title: "RAID: Shadow Legends", partner: "Plarium", points: 8500, imageUrl: "https://picsum.photos/seed/raid/200/200", imageHint: "fantasy character", category: "Game", status: "Pending", date: "2024-07-20" },
    { id: "2", title: "Complete a Survey", partner: "YourSurveys", points: 500, imageUrl: "https://picsum.photos/seed/survey/200/200", imageHint: "checklist icon", category: "Survey", status: "Completed", date: "2024-07-19" },
    { id: "3", title: "Star Trek: Fleet Command", partner: "Scopely", points: 7200, imageUrl: "https://picsum.photos/seed/startrek/200/200", imageHint: "space ship", category: "Game", status: "Completed", date: "2024-07-18" },
    { id: "4", title: "Bingo Blitz", partner: "Playtika", points: 4000, imageUrl: "https://picsum.photos/seed/bingo/200/200", imageHint: "bingo balls", category: "Game", status: "Rejected", date: "2024-07-17" },
    { id: "5", title: "Download TikTok", partner: "TikTok", points: 250, imageUrl: "https://picsum.photos/seed/tiktok/200/200", imageHint: "music note", category: "App", status: "Completed", date: "2024-07-16" },
    { id: "6", title: "History Quiz", partner: "Quiz Time", points: 100, imageUrl: "https://picsum.photos/seed/quiz/200/200", imageHint: "question mark", category: "Quiz", status: "Pending", date: "2024-07-21" },
];

export const quickTasks: Offer[] = [
    { id: "q1", title: "Watch a Video", partner: "AdColony", points: 50, imageUrl: "https://picsum.photos/seed/video/200/200", imageHint: "play button", category: "App" },
    { id: "q2", title: "Click a Link", partner: "Linkvertise", points: 20, imageUrl: "https://picsum.photos/seed/link/200/200", imageHint: "mouse cursor", category: "App" },
];

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
  totalPoints: 12500,
  dailyEarnings: 500,
  referralLink: "https://rewardspeak.com/ref/guest",
  referrals: 5,
  referralEarnings: 2500,
  lastLogin: "2024-01-01", // YYYY-MM-DD
};

export const offerWalls = [
    { name: "AdGate", logo: getPlaceholder("adgate-logo").url, hint: getPlaceholder("adgate-logo").hint, description: "A wide variety of offers." },
    { name: "TimeWall", logo: getPlaceholder("timewall-logo").url, hint: getPlaceholder("timewall-logo").hint, description: "Surveys, tasks, and more." },
    { name: "OfferToro", logo: getPlaceholder("offertoro-logo").url, hint: getPlaceholder("offertoro-logo").hint, description: "High-paying mobile offers." },
    { name: "CPALead", logo: getPlaceholder("cpalead-logo").url, hint: getPlaceholder("cpalead-logo").hint, description: "Daily surveys and app installs." },
];
