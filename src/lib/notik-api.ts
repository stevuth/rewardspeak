
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
  let countriesArray: string[] = [];

  if (rawCountries) {
    if (Array.isArray(rawCountries)) {
      // Handles case: ["US", "GB"]
      countriesArray = rawCountries.map(String).filter(Boolean);
    } else if (typeof rawCountries === 'object') {
      // Handles case: { "US": "United States", "GB": "United Kingdom" }
      countriesArray = Object.keys(rawCountries).filter(Boolean);
    } else if (typeof rawCountries === 'string' && rawCountries.trim() !== '') {
      // Handles case: "US,GB,CA"
      countriesArray = rawCountries.split(',').map(c => c.trim()).filter(Boolean);
    }
  }

  // If after all checks the array is empty, default to a universal "ALL"
  if (countriesArray.length === 0) {
    return ["ALL"];
  }

  return countriesArray;
}


// Helper to process and standardize an offer
function processOffer(rawOffer: RawNotikOffer): NotikOffer {
  // Standardize payout to a number, handling both string and number inputs
  const payoutValue = typeof rawOffer.payout === 'string'
    ? parseFloat(rawOffer.payout)
    : (rawOffer.payout || 0);

  const finalCountries = standardizeCountries(rawOffer.countries);

  return {
    ...rawOffer,
    payout: payoutValue,
    countries: finalCountries,
    // Ensure events also have numeric payout, handling potential strings
    events: (rawOffer.events || []).map(e => ({...e, payout: typeof e.payout === 'string' ? parseFloat(e.payout) : (e.payout || 0)}))
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

  while (nextPageUrl) {
    try {
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
        nextPageUrl = nextUrlFromData;
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
