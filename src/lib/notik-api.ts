
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
  payout_usd?: string;
  payout?: number | string;
  countries: any; // Can be a string or an array from the API
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

// Helper to process and standardize an offer
function processOffer(rawOffer: RawNotikOffer): NotikOffer {
  // Standardize payout to a number, handling both string and number inputs
  const payoutValue = typeof rawOffer.payout === 'string'
    ? parseFloat(rawOffer.payout)
    : (rawOffer.payout || 0);

  // Robustly standardize countries to a string array
  let countriesArray: string[] = [];
  const rawCountries = rawOffer.countries;

  if (Array.isArray(rawCountries) && rawCountries.length > 0) {
      countriesArray = rawCountries.map(String).filter(Boolean);
  } else if (typeof rawCountries === 'string' && rawCountries.trim() !== '') {
      countriesArray = rawCountries.split(',').map(c => c.trim()).filter(Boolean);
  } else if (rawCountries && typeof rawCountries === 'object' && Object.keys(rawCountries).length > 0) {
      // Handles cases where it might be an object like { "0": "US", "1": "CA" }
      countriesArray = Object.values(rawCountries).map(String).filter(Boolean);
  }

  // If after all checks the array is empty, default to ["ALL"]
  if (countriesArray.length === 0) {
    countriesArray = ["ALL"];
  }

  return {
    ...rawOffer,
    payout: payoutValue,
    countries: countriesArray,
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
