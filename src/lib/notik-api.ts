
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
  country_code: any; // Can be a string, array, or object.
}

interface ApiResponse {
  status: string;
  code?: string;
  message?: string;
  offers?: RawNotikOffer[];
  data?: {
    offers: RawNotikOffer[];
    next_page_url?: string | null;
  };
}

/**
 * Standardizes the 'country_code' field from the API into a consistent string array.
 * This function is designed to be very robust and handle various unexpected formats.
 * @param rawCountryCode - The raw country data from the Notik API.
 * @returns A string array of country codes. Defaults to ["ALL"] if input is empty or invalid.
 */
function standardizeCountries(rawCountryCode: any): string[] {
  // Case 1: Handle null, undefined, or empty string. Default to global.
  if (rawCountryCode === undefined || rawCountryCode === null || rawCountryCode === "") {
    return ["ALL"];
  }

  // Case 2: Handle if it's already a valid array.
  if (Array.isArray(rawCountryCode)) {
    // Handle the specific case where the API returns ["all"] for global offers.
    if (rawCountryCode.length === 1 && String(rawCountryCode[0]).toLowerCase() === 'all') {
      return ["ALL"];
    }
    const countries = rawCountryCode.map(c => String(c).toUpperCase().trim()).filter(Boolean); // Ensure all items are uppercase strings and not empty
    return countries.length > 0 ? countries : ["ALL"];
  }

  // Case 3: Handle a comma-separated string.
  if (typeof rawCountryCode === 'string') {
    const countries = rawCountryCode.split(',').map(c => c.trim().toUpperCase()).filter(Boolean);
    return countries.length > 0 ? countries : ["ALL"];
  }

  // Case 4: Handle an object like { "US": "United States" } or { "0": "US" }.
  if (typeof rawCountryCode === 'object' && !Array.isArray(rawCountryCode)) {
    const keys = Object.keys(rawCountryCode);
    if (keys.length === 0) {
      return ["ALL"];
    }
    // Check if keys are valid 2-letter country codes.
    const isCountryCodeKey = keys.every(key => /^[A-Z]{2}$/.test(key.toUpperCase()));
    if (isCountryCodeKey) {
      return keys.map(k => k.toUpperCase());
    }
    // Otherwise, assume the values are the country codes.
    const values = Object.values(rawCountryCode).map(String).filter(Boolean);
    if (values.length > 0) {
      return values.map(v => v.toUpperCase());
    }
  }

  // Fallback for any other unexpected type or empty collection.
  return ["ALL"];
}


// Helper to process and standardize an offer
function processOffer(rawOffer: RawNotikOffer): NotikOffer {
  const payoutValue = typeof rawOffer.payout === 'string'
    ? parseFloat(rawOffer.payout)
    : (rawOffer.payout || 0);

  const finalCountries = standardizeCountries(rawOffer.country_code);

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
        const rawText = await response.text();
        throw new Error(`API call failed with status: ${response.status}. Body: ${rawText}`);
    }
    
    const data: ApiResponse = await response.json();
    
    const offersData = data.offers as RawNotikOffer[];

    if (data.status === 'success' && Array.isArray(offersData)) {
      return offersData.map(processOffer);
    } else {
      throw new Error(`API status not 'success' or offers not an array.`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in getOffers:", errorMessage);
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
      
      const offersData = data.data?.offers;

      if (data.status === 'success' && Array.isArray(offersData)) {
        const offers = offersData.map(processOffer);
        allOffers = allOffers.concat(offers);
        
        const nextUrlFromData = data.data?.next_page_url;
        nextPageUrl = nextUrlFromData ? `${nextUrlFromData}&api_key=${apiKey}&pub_id=${pubId}&app_id=${appId}` : null;
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
