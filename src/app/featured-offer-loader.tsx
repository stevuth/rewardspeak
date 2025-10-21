
import { HomePageContent } from "@/app/home-page-content";
import { createSupabaseAdminClient } from "@/utils/supabase/admin";

export async function FeaturedOfferLoader() {
    const supabase = createSupabaseAdminClient();
    const { data: featuredOffers, error } = await supabase
        .from('top_converting_offers')
        .select('*')
        .order('payout', { ascending: false })
        .limit(6);

    if (error) {
        console.error("Error fetching featured offers:", error);
        return <HomePageContent featuredOffers={[]} />;
    }

    return <HomePageContent featuredOffers={featuredOffers || []} />
}
