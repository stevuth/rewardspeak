
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- Start of inlined notik-api.ts content ---

export interface NotikOffer {
  offer_id: string;
  name: string;
  description: string;
  click_url: string;
  image_url: string;
  network: string;
  payout: number;
  countries: string[];
  platforms: string[];
  devices: string[];
  categories: string[];
  events?: { id: number, name: string, payout: number }[];
}

// Internal type for handling the raw API response which has inconsistent country and payout types
interface RawNotikOffer extends Omit<NotikOffer, 'payout' | 'countries' | 'description' | 'devices' | 'platforms'> {
  payout?: number | string;
  country_code: any; // Can be a string, array, or object.
  devices: any;
  os: any; // This is the 'platforms' field
  description1?: string;
}

interface ApiResponse {
  status: string;
  code?: string;
  message?: string;
  offers: {
    data?: RawNotikOffer[];
    next_page_url?: string | null;
  };
}

function standardizeCountries(rawCountryCode: any): string[] {
  if (rawCountryCode === undefined || rawCountryCode === null || rawCountryCode === "") {
    return ["ALL"];
  }

  if (Array.isArray(rawCountryCode)) {
    if (rawCountryCode.length === 1 && String(rawCountryCode[0]).toLowerCase() === 'all') {
      return ["ALL"];
    }
    const countries = rawCountryCode.map(c => String(c).toUpperCase().trim()).filter(Boolean);
    return countries.length > 0 ? countries : ["ALL"];
  }

  if (typeof rawCountryCode === 'string') {
    const countries = rawCountryCode.split(',').map(c => c.trim().toUpperCase()).filter(Boolean);
    return countries.length > 0 ? countries : ["ALL"];
  }

  if (typeof rawCountryCode === 'object' && !Array.isArray(rawCountryCode)) {
    const keys = Object.keys(rawCountryCode);
    if (keys.length === 0) {
      return ["ALL"];
    }
    const isCountryCodeKey = keys.every(key => /^[A-Z]{2}$/.test(key.toUpperCase()));
    if (isCountryCodeKey) {
      return keys.map(k => k.toUpperCase());
    }
    const values = Object.values(rawCountryCode).map(String).filter(Boolean);
    if (values.length > 0) {
      return values.map(v => v.toUpperCase());
    }
  }

  return ["ALL"];
}

function processOffer(rawOffer: RawNotikOffer): NotikOffer {
  const payoutValue = typeof rawOffer.payout === 'string'
    ? parseFloat(rawOffer.payout)
    : (rawOffer.payout || 0);

  const finalCountries = standardizeCountries(rawOffer.country_code);
  const description = (rawOffer.description1 && rawOffer.description1.trim()) ? rawOffer.description1.trim() : '';
  const devices = Array.isArray(rawOffer.devices) ? rawOffer.devices.map(String).filter(Boolean) : [];
  const platforms = Array.isArray(rawOffer.os) ? rawOffer.os.map(String).filter(Boolean) : [];

  return {
    ...rawOffer,
    description: description,
    payout: payoutValue,
    countries: finalCountries,
    devices: devices,
    platforms: platforms,
    events: (rawOffer.events || []).map(e => ({
      ...e, 
      payout: typeof e.payout === 'string' ? parseFloat(e.payout) : (e.payout || 0)
    }))
  };
}

async function getAllOffers(): Promise<{ offers: NotikOffer[], log: string }> {
  const apiKey = Deno.env.get('NOTIK_API_KEY');
  const pubId = Deno.env.get('NOTIK_PUB_ID');
  const appId = Deno.env.get('NOTIK_APP_ID');
  
  let log = '';

  if (!apiKey || !pubId || !appId) {
    log = "CRITICAL ERROR: Server-side Notik API credentials (NOTIK_API_KEY, NOTIK_PUB_ID, NOTIK_APP_ID) are not set in environment variables.\n";
    return { offers: [], log };
  }

  let allOffers: NotikOffer[] = [];
  let pageNum = 1;
  let nextPageUrl: string | null | undefined = `https://notik.me/api/v2/get-offers/all?api_key=${apiKey}&pub_id=${pubId}&app_id=${appId}`;
  
  const headers = {
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
  };

  log += `Starting server-side offer sync...\n`;

  while (nextPageUrl) {
    log += `Fetching page ${pageNum}...\n`;
    
    try {
      const response = await fetch(nextPageUrl, { headers });
      const responseBodyText = await response.text();

      if (!response.ok) {
        log += `ERROR: API call failed with status ${response.status}. Body: ${responseBodyText}\n`;
        break; 
      }
      
      const data: ApiResponse = JSON.parse(responseBodyText);
      const offersData = data.offers?.data;

      if (data.status === 'success' && Array.isArray(offersData)) {
        const processedOffers = offersData.map(processOffer);
        allOffers = allOffers.concat(processedOffers);
        log += `Page ${pageNum} successful. Fetched ${processedOffers.length} offers. Total: ${allOffers.length}.\n`;
        
        nextPageUrl = data.offers?.next_page_url;
        if (nextPageUrl) {
           nextPageUrl += `&api_key=${apiKey}&pub_id=${pubId}&app_id=${appId}`;
        }
        pageNum++;
      } else {
        log += `API call for page ${pageNum} not successful. Status: ${data.status}, Message: ${data.message || 'No message'}.\n`;
        break;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown fetch error.";
      log += `FATAL ERROR on page ${pageNum}: ${errorMessage}\n`;
      break; 
    }
  }
  log += `Server sync finished. Total unique offers: ${allOffers.length}.\n`;
  return { offers: allOffers, log };
}

// --- End of inlined notik-api.ts content ---


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to split an array into chunks
function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function syncOffersToDb(offers: NotikOffer[], supabase: SupabaseClient): Promise<{ error?: string, log: string }> {
  let log = "";
  try {
    const prepareOffersData = (offersToPrepare: NotikOffer[]) => {
      const uniqueOffersMap = new Map<string, NotikOffer>();
      for (const offer of offersToPrepare) {
        if (!uniqueOffersMap.has(offer.offer_id)) {
          uniqueOffersMap.set(offer.offer_id, offer);
        }
      }
      const uniqueOffers = Array.from(uniqueOffersMap.values());
      log += `Found ${uniqueOffers.length} unique offers out of ${offersToPrepare.length} total.\n`;

      return uniqueOffers.map(offer => ({
        offer_id: offer.offer_id,
        name: offer.name,
        description: offer.description || "",
        click_url: offer.click_url,
        image_url: offer.image_url,
        network: offer.network,
        payout: offer.payout,
        countries: offer.countries,
        platforms: offer.platforms,
        devices: offer.devices,
        categories: offer.categories,
        events: offer.events,
        created_at: new Date().toISOString(),
      }));
    };

    const BATCH_SIZE = 500;
    const allOffersData = prepareOffersData(offers);
    const allOfferChunks = chunk(allOffersData, BATCH_SIZE);

    log += `Prepared ${allOffersData.length} unique offers. Splitting into ${allOfferChunks.length} chunk(s).\n`;

    for (let i = 0; i < allOfferChunks.length; i++) {
      const allChunk = allOfferChunks[i];
      log += `Upserting chunk ${i + 1}/${allOfferChunks.length} with ${allChunk.length} offers...\n`;
      const { error: allOffersError } = await supabase.from('all_offers').upsert(allChunk, { onConflict: 'offer_id' });
      if (allOffersError) {
        throw new Error(`DB chunk ${i + 1} upsert error: ${allOffersError.message}`);
      }
      log += `Chunk ${i + 1} upserted successfully.\n`;
    }

    log += "Database sync complete!\n";
    return { log };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during DB sync.";
    log += `❌ DB Sync failed: ${errorMessage}\n`;
    return { error: errorMessage, log };
  }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let log = "Automated sync process initiated via Supabase Edge Function...\n";

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { offers: fetchedOffers, log: fetchLog } = await getAllOffers();
    log += fetchLog;

    if (fetchedOffers.length === 0) {
      log += "No offers fetched. Sync process concluded.\n";
       await supabaseAdmin.from('cron_logs').insert({
          status: 'success',
          log_message: log,
          offers_synced_count: 0,
      });
      return new Response(JSON.stringify({ success: true, message: log }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { error: syncError, log: syncLog } = await syncOffersToDb(fetchedOffers, supabaseAdmin);
    log += syncLog;

    if (syncError) {
      throw new Error(syncError);
    }

    await supabaseAdmin.from('cron_logs').insert({
        status: 'success',
        log_message: log,
        offers_synced_count: fetchedOffers.length,
    });
    
    return new Response(JSON.stringify({ success: true, message: log }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    log += `FATAL ERROR: ${errorMessage}\n`;
    console.error("[EDGE FUNCTION ERROR]", log);
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
     await supabaseAdmin.from('cron_logs').insert({
        status: 'failure',
        log_message: log,
        offers_synced_count: 0,
    });

    return new Response(JSON.stringify({ error: 'Cron job failed.', details: errorMessage }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
    });
  }
});
