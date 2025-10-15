
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
  isPopular?: boolean;
  isQuickTask?: boolean;
};

export const popularOffers: Omit<Offer, 'id'>[] = [
    { title: 'Lords Mobile: Reach Castle Lvl 25', partner: 'Lootably', points: 5400, imageUrl: getPlaceholder("game-icon-1").url, imageHint: getPlaceholder("game-icon-1").hint, category: 'Game' },
    { title: 'RAID: Shadow Legends - Get 2 Sacred Shards', partner: 'AdGate', points: 8100, imageUrl: getPlaceholder("game-icon-2").url, imageHint: getPlaceholder("game-icon-2").hint, category: 'Game' },
    { title: 'Star Trek Fleet Command - Lvl 21', partner: 'OfferToro', points: 12000, imageUrl: getPlaceholder("game-icon-3").url, imageHint: getPlaceholder("game-icon-3").hint, category: 'Game' },
    { title: 'Complete a Survey', partner: 'CPX Research', points: 800, imageUrl: getPlaceholder("survey-icon-1").url, imageHint: getPlaceholder("survey-icon-1").hint, category: 'Survey' },
];

export const quickTasks: Omit<Offer, 'id'>[] = [
    { title: 'Sign up for a Newsletter', partner: 'InboxDollars', points: 50, imageUrl: getPlaceholder("task-icon-1").url, imageHint: getPlaceholder("task-icon-1").hint, category: 'App' },
    { title: 'Install a Browser Extension', partner: 'MyPoints', points: 150, imageUrl: getPlaceholder("task-icon-2").url, imageHint: getPlaceholder("task-icon-2").hint, category: 'App' },
    { title: 'Watch a Video', partner: 'Swagbucks', points: 20, imageUrl: getPlaceholder("task-icon-3").url, imageHint: getPlaceholder("task-icon-3").hint, category: 'Quiz' },
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
    { rank: 1, name: 'ClimberKing', points: 152000, avatarUrl: getPlaceholder("leaderboard-user-1").url, avatarHint: getPlaceholder("leaderboard-user-1").hint, prize: 500 },
    { rank: 2, name: 'PeakQueen', points: 148000, avatarUrl: getPlaceholder("leaderboard-user-2").url, avatarHint: getPlaceholder("leaderboard-user-2").hint, prize: 250 },
    { rank: 3, name: 'SummitSeeker', points: 145000, avatarUrl: getPlaceholder("leaderboard-user-3").url, avatarHint: getPlaceholder("leaderboard-user-3").hint, prize: 100 },
    { rank: 4, name: 'MountainMover', points: 139000, avatarUrl: getPlaceholder("leaderboard-user-4").url, avatarHint: getPlaceholder("leaderboard-user-4").hint },
    { rank: 5, name: 'TopTier', points: 132000, avatarUrl: getPlaceholder("leaderboard-user-5").url, avatarHint: getPlaceholder("leaderboard-user-5").hint },
];

export type OfferWall = {
  name: string;
  logo: string;
  hint: string;
  description: string;
};

export const offerWalls: OfferWall[] = [
    { name: "AdGate", logo: getPlaceholder("adgate-logo").url, hint: getPlaceholder("adgate-logo").hint, description: "A wide variety of offers." },
    { name: "TimeWall", logo: getPlaceholder("timewall-logo").url, hint: getPlaceholder("timewall-logo").hint, description: "Surveys, tasks, and more." },
    { name: "OfferToro", logo: getPlaceholder("offertoro-logo").url, hint: getPlaceholder("offertoro-logo").hint, description: "High-paying mobile offers." },
    { name: "CPALead", logo: getPlaceholder("cpalead-logo").url, hint: getPlaceholder("cpalead-logo").hint, description: "Daily surveys and app installs." },
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


export type Withdrawal = {
  id: string;
  method: string;
  amount: number; // in points
  date: string;
  status: "Completed" | "Pending" | "Failed";
};

export const withdrawalHistory: Withdrawal[] = [
    { id: 'wd-1', method: 'PayPal', amount: 5000, date: '2023-10-26', status: 'Completed' },
    { id: 'wd-2', method: 'Bitcoin', amount: 10000, date: '2023-10-24', status: 'Completed' },
    { id: 'wd-3', method: 'Litecoin', amount: 2500, date: '2023-10-23', status: 'Pending' },
    { id: 'wd-4', method: 'PayPal', amount: 1000, date: '2023-10-22', status: 'Failed' },
];
