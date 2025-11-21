import React from 'react';
import { HomePageContent } from "@/app/home-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rewards Peak - #1 Platform to Earn Money Online",
  description: "Start earning today with Rewards Peak. Complete simple tasks, take surveys, and get paid in cash, crypto, or gift cards. Sign up now!",
  alternates: {
    canonical: "https://rewardspeak.com",
  },
};

export default async function Home() {

  return (
    <HomePageContent />
  );
}
