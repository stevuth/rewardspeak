
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

// Internal type for handling the raw API response
interface RawNotikOffer extends Omit<NotikOffer, 'payout' | 'countries'> {
  payout_usd?: string;
  payout?: number;
  countries: any; // Can be a string or an array
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
  const payoutValue = rawOffer.payout_usd ? parseFloat(rawOffer.payout_usd) : (rawOffer.payout || 0);
  
  let countriesArray: string[] = [];
  if (typeof rawOffer.countries === 'string') {
    // If it's a comma-separated string, split it into an array
    countriesArray = rawOffer.countries.split(',').map(c => c.trim()).filter(Boolean);
  } else if (Array.isArray(rawOffer.countries)) {
    // If it's already an array, use it directly
    countriesArray = rawOffer.countries;
  }

  return {
    ...rawOffer,
    payout: payoutValue,
    countries: countriesArray,
    // Ensure events also have numeric payout
    events: (rawOffer.events || []).map(e => ({...e, payout: e.payout || 0}))
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
    const response = await fetch(apiUrl, { next: { revalidate: 3600 } });
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
      const response = await fetch(nextPageUrl, { next: { revalidate: 900 } });
      if (!response.ok) {
        console.error(`API call failed with status: ${response.status} for URL: ${nextPageUrl}`);
        const errorBody = await response.text();
        console.error("API Error Body:", errorBody);
        break; 
      }
      const data: ApiResponse = await response.json();
      
      if (data.status === 'success' && data.data?.offers) {
        const offers = data.data.offers.map(processOffer);
        allOffers = allOffers.concat(offers);
        nextPageUrl = data.data.next_page_url;
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
