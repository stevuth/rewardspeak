
import { createSupabaseAdminClient } from "@/utils/supabase/admin";
import { HomePageContent } from "@/app/home-page-content";

export async function FeaturedOfferLoader() {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from('top_converting_offers')
        .select('*')
        .order('payout', { ascending: false })
        .limit(2);
    
    if (error) {
        console.error("Error fetching featured offers:", error);
    }
  
    const featuredOffers = data || [];

    return <HomePageContent featuredOffers={featuredOffers} />
}
