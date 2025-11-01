
export interface NotikOffer {
  offer_id: string;
  name: string;
  description: string;
  click_url: string;
  image_url: string;
  network: string;
  payout: number;
  countries: string[];
  platforms: ('ios' | 'android' | 'desktop' | 'all')[];
  categories: string[];
  events?: { id: number, name: string, payout: number }[];
}

// Internal type for handling the raw API response which has inconsistent country and payout types
interface RawNotikOffer extends Omit<NotikOffer, 'payout' | 'countries'> {
  payout?: number | string;
  countries: any; // Can be a string, array, or object from the API
}

interface ApiOfferResponse {
  data: RawNotikOffer[];
  next_page_url?: string | null;
}

interface ApiResponse {
  status: string;
  code?: string;
  message?: string;
  offers?: ApiOfferResponse;
  data?: {
    offers: RawNotikOffer[];
    next_page_url?: string | null;
  };
}

/**
 * Standardizes the 'countries' field from the API into a consistent string array.
 * The API can return this data as an object of key-value pairs, an array, a string, or null.
 * @param rawCountries - The raw country data from the Notik API.
 * @returns A string array of country codes. Defaults to ["ALL"] if input is empty or invalid.
 */
function standardizeCountries(rawCountries: any): string[] {
  // If rawCountries is falsy, empty, or an empty object, it's global.
  if (!rawCountries || (typeof rawCountries === 'object' && Object.keys(rawCountries).length === 0)) {
    return ["ALL"];
  }

  // Case 1: It's an array of strings (e.g., ["US", "GB"])
  if (Array.isArray(rawCountries)) {
    const countries = rawCountries.map(String).filter(Boolean);
    return countries.length > 0 ? countries : ["ALL"];
  }

  // Case 2: It's a comma-separated string (e.g., "US,GB,CA")
  if (typeof rawCountries === 'string' && rawCountries.trim() !== '') {
    const countries = rawCountries.split(',').map(c => c.trim().toUpperCase()).filter(Boolean);
    return countries.length > 0 ? countries : ["ALL"];
  }

  // Case 3: It's an object (e.g., { "US": "United States" } or { "0": "US" })
  if (typeof rawCountries === 'object') {
    // If keys are country codes (e.g., "US", "GB"), use the keys.
    const keys = Object.keys(rawCountries);
    const isCountryCodeKey = keys.every(key => /^[A-Z]{2}$/.test(key.toUpperCase()));
    if (isCountryCodeKey) {
      return keys.length > 0 ? keys : ["ALL"];
    }

    // If keys are numeric indices (e.g., "0", "1"), use the values.
    const values = Object.values(rawCountries).map(String).filter(Boolean);
    if (values.length > 0) {
      return values;
    }
  }

  // Default fallback if no other condition is met.
  return ["ALL"];
}


// Helper to process and standardize an offer
function processOffer(rawOffer: RawNotikOffer): NotikOffer {
  // 🔍 DEBUG: Log what we receive
  if (!rawOffer.countries) {
    console.log(`⚠️ Offer ${rawOffer.offer_id} has NO countries field in API response`);
  } else {
    console.log(`✓ Offer ${rawOffer.offer_id} countries (raw):`, typeof rawOffer.countries, rawOffer.countries);
  }
  
  const payoutValue = typeof rawOffer.payout === 'string'
    ? parseFloat(rawOffer.payout)
    : (rawOffer.payout || 0);

  const finalCountries = standardizeCountries(rawOffer.countries);
  
  console.log(`✓ Offer ${rawOffer.offer_id} countries (processed):`, finalCountries);

  return {
    ...rawOffer,
    description: rawOffer.description || rawOffer.name,
    payout: payoutValue,
    countries: finalCountries,
    events: (rawOffer.events || []).map(e => ({
      ...e, 
      payout: typeof e.payout === 'string' ? parseFloat(e.payout) : (e.payout || 0)
    }))
  };
}

export async function getOffers(): Promise<NotikOffer[]> {
  const apiKey = process.env.NOTIK_API_KEY;
  const pubId = process.env.NOTIK_PUB_ID;
  const appId = process.env.NOTIK_APP_ID;

  if (!apiKey || !pubId || !appId) {
    console.error("Notik API credentials are not set in environment variables.");
    return [];
  }

  const apiUrl = `https://notik.me/api/v2/get-top-converting-offers?api_key=${apiKey}&pub_id=${pubId}&app_id=${appId}&omit_survey=1`;

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 3600 } }); // Revalidate every hour
    if (!response.ok) {
      console.error(`API call failed with status: ${response.status}`);
      const errorBody = await response.text();
      console.error("API Error Body:", errorBody);
      return [];
    }
    const data: ApiResponse = await response.json();

    if (data.status === 'success' && data.data?.offers) {
      return data.data.offers.map(processOffer);
    } else {
      if (data.message) {
        console.error("API call was not successful:", data.message);
      } else {
        console.error("API call was not successful and returned no message. Full response:", JSON.stringify(data));
      }
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch offers:", error);
    return [];
  }
}

export async function getAllOffers(): Promise<NotikOffer[]> {
  const apiKey = process.env.NOTIK_API_KEY;
  const pubId = process.env.NOTIK_PUB_ID;
  const appId = process.env.NOTIK_APP_ID;

  if (!apiKey || !pubId || !appId) {
    console.error("Notik API credentials are not set in environment variables.");
    return [];
  }

  let allOffers: NotikOffer[] = [];
  let nextPageUrl: string | null | undefined = `https://notik.me/api/v2/get-offers/all?api_key=${apiKey}&pub_id=${pubId}&app_id=${appId}`;
  let pageCount = 0;

  while (nextPageUrl && pageCount < 1) { // Limit to 1 page for debugging
    pageCount++;
    try {
      console.log(`Fetching page ${pageCount} from: ${nextPageUrl}`);
      const response = await fetch(nextPageUrl, { next: { revalidate: 900 } }); // Revalidate every 15 minutes
      if (!response.ok) {
        console.error(`API call failed with status: ${response.status} for URL: ${nextPageUrl}`);
        const errorBody = await response.text();
        console.error("API Error Body:", errorBody);
        break; 
      }
      const data: ApiResponse = await response.json();
      
      const offersData = data.data?.offers ?? data.offers?.data;

      if (data.status === 'success' && offersData) {
        const offers = offersData.map(processOffer);
        allOffers = allOffers.concat(offers);
        
        const nextUrlFromData = data.data?.next_page_url ?? data.offers?.next_page_url;
        
        console.log("Debug mode: stopping after one page. Full sync would continue.");
        nextPageUrl = null; // Stop after one page for debugging

      } else {
        if (data.message) {
            console.error("API call was not successful:", data.message);
        } else {
            console.error("API call was not successful and returned no message. Full response:", JSON.stringify(data));
        }
        break;
      }
    } catch (error) {
      console.error(`Failed to fetch offers from ${nextPageUrl}:`, error);
      break; 
    }
  }

  return allOffers;
}
