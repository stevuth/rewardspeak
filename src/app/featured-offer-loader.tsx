
import { HomePageContent } from "@/app/home-page-content";

export async function FeaturedOfferLoader() {
    const featuredOffers = [
        {
            offer_id: 'monopoly-go',
            name: 'Monopoly Go!',
            description: 'Become a tycoon! Roll the dice and build your empire in this classic board game with a twist.',
            image_url: 'https://play-lh.googleusercontent.com/d_TGHcM9SoLSEs_T9U-s2A2aI99w0-9Gz_SPjt2v551jdyS29jByx05C4aJ4n22Iig',
            payout: 50.00,
        },
        {
            offer_id: 'river-dash',
            name: 'River Dash',
            description: 'Navigate treacherous waters, collect gems, and set a new high score in this thrilling endless runner.',
            image_url: 'https://play-lh.googleusercontent.com/D_i-s_1vYnO3VusG5E-pIiwT8l1z5sW_5I1e1R1q1xBl_k95lQ-w-hO7-8s6Y1T2gA=w240-h480-rw',
            payout: 35.00,
        }
    ];

    return <HomePageContent featuredOffers={featuredOffers} />
}
