
import { HomePageContent } from "@/app/home-page-content";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function FeaturedOfferLoader() {
    const supabase = createSupabaseServerClient();

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
        .from('top_converting_offers')
        .select('*')
        .in('name', curatedOfferNames)
        .order('payout', { ascending: false });

    if (error) {
        console.error("Error fetching featured offers:", error);
        return <HomePageContent featuredOffers={[]} />;
    }

    // Ensure offers are unique by name
    const uniqueOffers = Array.from(new Map(featuredOffers.map(offer => [offer.name, offer])).values());

    return <HomePageContent featuredOffers={uniqueOffers || []} />
}
