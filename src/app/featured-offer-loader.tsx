
import { HomePageContent } from "@/app/home-page-content";
import { createSupabaseAdminClient } from "@/utils/supabase/admin";

export async function FeaturedOfferLoader() {
    const supabase = createSupabaseAdminClient();

    // A curated list of offers known to have colorful images.
    const curatedOfferNames = [
        'Forest Cleaner',
        'Magnet Miner',
        'Pop Ballon',
        'Monopoly Go',
        'Prime Video',
        'Sea Explorer',
        'Wishing Well',
        'Gardden Gnome',
        'River Dash'
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

    return <HomePageContent featuredOffers={featuredOffers || []} />
}
