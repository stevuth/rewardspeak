
'use client';

import { toast } from '@/hooks/use-toast';
import { RewardToast } from '@/components/reward-toast';
import { LogIn, LogOut, Rocket, HandCoins, Target } from 'lucide-react';
import React from 'react';

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

// Directly use the components, not strings.
const loginIcons = [Rocket, Target, HandCoins];
const logoutIcons = [LogOut, HandCoins];

// Function to get a random item from an array
const getRandomItem = <T,>(array: T[]): T => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const getUsername = (email?: string | null) => {
    if (!email) return "Climber";
    return email.split('@')[0];
}

export const showLoginToast = (email?: string | null) => {
  const username = getUsername(email);
  const message = getRandomItem(loginMessages).replace('{username}', username);
  const Icon = getRandomItem(loginIcons);
  
  toast({
    duration: 5000,
    component: <RewardToast message={message} icon={Icon} username={username} />,
  });
};

export const showLogoutToast = (email?: string | null) => {
  const username = getUsername(email);
  const message = getRandomItem(logoutMessages).replace('{username}', username);
  const Icon = getRandomItem(logoutIcons);

  toast({
    duration: 5000,
    component: <RewardToast message={message} icon={Icon} username={username} />,
  });
};
