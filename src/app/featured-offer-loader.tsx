
import { HomePageContent } from "@/app/home-page-content";
import { createSupabaseAdminClient } from "@/utils/supabase/admin";

export async function FeaturedOfferLoader() {
    const supabase = createSupabaseAdminClient();

    // A curated list of offers known to have colorful images.
    const curatedOfferNames = [
        'Video Poker',
        'Upside',
        'Richie Games',
        'RAID Shadow Legends',
        'Crypto Miner',
        'Slot Mate',
    ];

    const { data: featuredOffers, error } = await supabase
        .from('all_offers')
        .select('*')
        .in('name', curatedOfferNames)
        .order('payout', { ascending: false });

    if (error) {
        console.error("Error fetching featured offers:", error);
        return <HomePageContent featuredOffers={[]} />;
    }

    // Ensure offers are unique
    const uniqueOffers = Array.from(new Map(featuredOffers.map(offer => [offer.offer_id, offer])).values());

    return <HomePageContent featuredOffers={uniqueOffers || []} />
}
