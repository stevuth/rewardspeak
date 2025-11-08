
import { HomePageContent } from '@/app/home-page-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Join Rewards Peak and Earn a $1 Bonus!',
    description: "Sign up for Rewards Peak, the ultimate platform to earn real cash by completing tasks, playing games, and taking surveys. Get a $1 welcome bonus when you join!",
    openGraph: {
        title: 'Join Rewards Peak and Earn a $1 Bonus!',
        description: "I'm earning real cash on Rewards Peak! Sign up with my link to get a $1 welcome bonus and start earning today. 🚀",
        url: 'https://rewardspeak.com/join',
        siteName: 'Rewards Peak',
        images: [
            {
                url: 'https://rewardspeak.com/og-referral-image.png', // This is a placeholder, you should create and host this image.
                width: 1200,
                height: 630,
                alt: 'Rewards Peak Referral Bonus',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Join Rewards Peak and Earn a $1 Bonus!',
        description: "I'm earning real cash on Rewards Peak! Sign up with my link to get a $1 welcome bonus and start earning today. 🚀",
        images: ['https://rewardspeak.com/og-referral-image.png'],
    },
};

// The content of this page is the same as the homepage.
// Its primary purpose is to provide the custom Open Graph metadata for referral links.
export default function JoinPage() {
  return <HomePageContent />;
}
