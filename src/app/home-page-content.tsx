
import React from 'react';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { HomePageClient } from './home-page-client';

async function getHomePageData() {
    const supabase = createSupabaseServerClient();
    const featuredOfferNames = ["raids shadow", "richie games", "upside", "bingo vacation", "crypto mine", "state of survival"];
    const phoneCardOfferNames = ["bitcoin tiles", "slot mate", "call of dragons", "fish of fortune"];

    try {
        const orFilter = featuredOfferNames.map(name => `name.ilike.%${name}%`).join(',');
        const { data: featuredData, error: featuredError } = await supabase
            .from('all_offers')
            .select('*')
            .or(orFilter)
            .limit(20);

        if (featuredError) throw featuredError;

        const uniqueFeaturedOffers = new Map();
        featuredOfferNames.forEach(name => {
            const bestMatch = featuredData.find(offer => offer.name.toLowerCase().includes(name));
            if (bestMatch && !uniqueFeaturedOffers.has(bestMatch.offer_id)) {
                uniqueFeaturedOffers.set(bestMatch.offer_id, bestMatch);
            }
        });
        
        const phoneCardPromises = phoneCardOfferNames.map(name =>
            supabase
                .from('all_offers')
                .select('name, image_url, categories, payout, offer_id')
                .not('image_url', 'is', null)
                .neq('image_url', '')
                .ilike('name', `%${name}%`)
                .order('payout', { ascending: false })
                .limit(1)
                .single()
        );
        
        const phoneCardResults = await Promise.allSettled(phoneCardPromises);
        const phoneCardOffers = phoneCardResults
            .map(result => (result.status === 'fulfilled' ? result.value.data : null))
            .filter(Boolean);

        return {
            featuredOffers: Array.from(uniqueFeaturedOffers.values()),
            phoneCardOffers: phoneCardOffers
        };

    } catch (error: any) {
        console.error("Error fetching homepage data:", error.message || error);
        return { featuredOffers: [], phoneCardOffers: [] };
    }
}


export async function HomePageContent() {
    const { featuredOffers, phoneCardOffers } = await getHomePageData();

    return (
      <HomePageClient
        featuredOffers={featuredOffers}
        phoneCardOffers={phoneCardOffers}
      />
    );
}
