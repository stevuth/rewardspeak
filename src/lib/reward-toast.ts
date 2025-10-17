'use client';

import { toast } from '@/hooks/use-toast';
import { RewardToast } from '@/components/reward-toast';
import { LogIn, LogOut, Rocket, HandCoins, Target } from 'lucide-react';

const loginMessages = [
  "Hey {username}, it’s a great day to earn more on Rewards Peak!",
  "Welcome back, {username}! Your next reward is just a few clicks away.",
  "Nice to see you again! New offers and quick tasks are waiting.",
];

const logoutMessages = [
  "Thanks for stopping by, {username}! Your rewards are waiting for your next visit.",
  "New offers are added every few hours — come back soon and grab yours!",
  "Your wallet’s not full yet 😉 Come back later to top it up!",
];

const loginIcons = [Rocket, Target, HandCoins];
const logoutIcons = [LogOut, HandCoins];

// Function to get a random item from an array, avoiding the last one if possible
const getRandomItem = <T>(array: T[], lastItemKey: string): T => {
  const lastItem = sessionStorage.getItem(lastItemKey);
  let availableItems = array;

  if (lastItem && array.length > 1) {
    availableItems = array.filter(item => JSON.stringify(item) !== lastItem);
  }

  const randomIndex = Math.floor(Math.random() * availableItems.length);
  const selected = availableItems[randomIndex];
  
  sessionStorage.setItem(lastItemKey, JSON.stringify(selected));
  return selected;
};

const getUsername = (email?: string | null) => {
    if (!email) return "Climber";
    return email.split('@')[0];
}

export const showLoginToast = (email?: string | null) => {
  const username = getUsername(email);
  const message = getRandomItem(loginMessages, 'lastLoginMessage').replace('{username}', username);
  const Icon = getRandomItem(loginIcons, 'lastLoginIcon');
  
  toast({
    duration: 5000,
    component: <RewardToast message={message} icon={Icon} username={username} />,
  });
};

export const showLogoutToast = (email?: string | null) => {
  const username = getUsername(email);
  const message = getRandomItem(logoutMessages, 'lastLogoutMessage').replace('{username}', username);
  const Icon = getRandomItem(logoutIcons, 'lastLogoutIcon');

  toast({
    duration: 5000,
    component: <RewardToast message={message} icon={Icon} username={username} />,
  });
};
