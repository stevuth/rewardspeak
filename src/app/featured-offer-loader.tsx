
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
        },
        {
            offer_id: 'magnet-miner',
            name: 'Magnet Miner',
            description: 'Dig deep and collect rare gems with your powerful magnet. Upgrade your gear for bigger rewards.',
            image_url: 'https://play-lh.googleusercontent.com/t-YV5P6D11Cg2E6rS-2C7p3B0p_w_G5v_pM-jS-jY9_o_tJzUeVGI-z0-A',
            payout: 42.50,
        },
        {
            offer_id: 'prime-video',
            name: 'Prime Video',
            description: 'Watch your favorite movies and TV shows. Sign up and get a bonus for streaming.',
            image_url: 'https://play-lh.googleusercontent.com/VojafVZNddI6JvdDGWt4Iny-9_VAEGHj3QHe-6bA5y0B3e0iABp-hdR_y22I4_1Y_Q',
            payout: 15.00,
        },
        {
            offer_id: 'prize-bear',
            name: 'Prize Bear',
            description: 'Play fun mini-games and win real prizes with this adorable bear. Daily challenges await!',
            image_url: 'https://play-lh.googleusercontent.com/j7c2o-aK5g5A2x-2q3L-YFkZ-9E-L-E-Q-p-p-E-T-b-z-x-F-E-e-A',
            payout: 28.00,
        },
        {
            offer_id: 'sea-explorer',
            name: 'Sea Explorer',
            description: 'Explore the depths of the ocean, discover new species, and uncover hidden treasures.',
            image_url: 'https://play-lh.googleusercontent.com/y-x-l-Q-R-A-n-y-E-H-c-g-P-w-x-X-c-l-A-Z-I-J-a-s-d-f-g-h-j',
            payout: 38.00,
        }
    ];

    return <HomePageContent featuredOffers={featuredOffers} />
}
