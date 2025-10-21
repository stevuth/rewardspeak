
import { HomePageContent } from "@/app/home-page-content";
import { createSupabaseAdminClient } from "@/utils/supabase/admin";

export async function FeaturedOfferLoader() {
    const supabase = createSupabaseAdminClient();

    // A curated list of offers known to have colorful images.
    const curatedOfferNames = [
        'Dice Dreams',
        'RAID Shadow Legends',
        'Coin Master',
        'Royal Match',
        'Bingo Blitz',
        'Solitaire Grand Harvest'
    ];

    const { data: featuredOffers, error } = await supabase
        .from('top_converting_offers')
        .select('*')
        .in('name', curatedOfferNames)
        .order('payout', { ascending: false })
        .limit(6);

    if (error) {
        console.error("Error fetching featured offers:", error);
        return <HomePageContent featuredOffers={[]} />;
    }

    // If we get fewer than 6 curated offers, fetch the rest by highest payout to fill the carousel.
    if (featuredOffers.length < 6) {
        const remainingLimit = 6 - featuredOffers.length;
        const existingOfferIds = featuredOffers.map(o => o.offer_id);

        const { data: remainingOffers, error: remainingError } = await supabase
            .from('top_converting_offers')
            .select('*')
            .not('offer_id', 'in', `(${existingOfferIds.join(',')})`)
            .order('payout', { ascending: false })
            .limit(remainingLimit);
        
        if (remainingError) {
             console.error("Error fetching remaining offers:", remainingError);
        } else if (remainingOffers) {
            featuredOffers.push(...remainingOffers);
        }
    }


    return <HomePageContent featuredOffers={featuredOffers || []} />
}
