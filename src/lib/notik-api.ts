
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

  const description = (rawOffer.description1 && rawOffer.description1.trim()) ? rawOffer.description1.trim() : '';

  // Safely handle the devices field
  const devices = Array.isArray(rawOffer.devices) ? rawOffer.devices.map(String).filter(Boolean) : [];
  
  // Safely handle the os field (as platforms)
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

export async function getOffers(): Promise<{ offers: NotikOffer[], log: string }> {
  const apiKey = process.env.NOTIK_API_KEY;
  const pubId = process.env.NOTIK_PUB_ID;
  const appId = process.env.NOTIK_APP_ID;
  let log = '';

  if (!apiKey || !pubId || !appId) {
    log = "Error: Notik API credentials are not set in environment variables.";
    console.error(log);
    return { offers: [], log };
  }

  const apiUrl = `https://notik.me/api/v2/get-top-converting-offers?api_key=${apiKey}&pub_id=${pubId}&app_id=${appId}&omit_survey=1`;
  log += `Requesting URL: ${apiUrl}\n`;

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 3600 } }); // Revalidate every hour
    
    if (!response.ok) {
        const rawText = await response.text();
        if (response.status === 429) {
          log += "Warning: Notik API rate limit hit for top converting offers. Skipping this cycle.\n";
          console.warn(log);
          return { offers: [], log };
        }
        throw new Error(`API call failed with status: ${response.status}. Body: ${rawText}`);
    }
    
    const data: ApiResponse = await response.json();
    
    const offersData = data.offers?.data;

    if (data.status === 'success' && Array.isArray(offersData)) {
      log += `API returned success with ${offersData.length} offers.\n`;
      return { offers: offersData.map(processOffer), log };
    } else {
      log += `API status not 'success' or offers not an array. Status: ${data.status}. Message: ${data.message || 'N/A'}\n`;
      console.warn(log);
      return { offers: [], log };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log += `Error in getOffers: ${errorMessage}\n`;
    console.error(log);
    return { offers: [], log };
  }
}

export async function getAllOffers(): Promise<{ offers: NotikOffer[], log: string }> {
  const apiKey = process.env.NOTIK_API_KEY;
  const pubId = process.env.NOTIK_PUB_ID;
  const appId = process.env.NOTIK_APP_ID;
  
  let log = '';

  if (!apiKey || !pubId || !appId) {
    log = "CRITICAL ERROR: Notik API credentials (API_KEY, PUB_ID, APP_ID) are not set in environment variables.\n";
    console.error(log);
    return { offers: [], log };
  }

  let allOffers: NotikOffer[] = [];
  let pageNum = 1;
  let nextPageUrl: string | null | undefined = `https://notik.me/api/v2/get-offers/all?api_key=${apiKey}&pub_id=${pubId}&app_id=${appId}`;
  
  const headers = {
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
  };

  log += `Starting offer sync...\n`;

  while (nextPageUrl) {
    log += `Fetching page ${pageNum}: ${nextPageUrl}\n`;
    console.log(`Fetching page ${pageNum}: ${nextPageUrl}`);
    try {
      const response = await fetch(nextPageUrl, { headers: headers, cache: 'no-store' });
      if (!response.ok) {
        const errorBody = await response.text();
        log += `ERROR: API call failed with status ${response.status} for URL: ${nextPageUrl}. Body: ${errorBody}\n`;
        console.error(log);
        break; 
      }
      const data: ApiResponse = await response.json();
      
      const offersData = data.offers?.data;

      if (data.status === 'success' && Array.isArray(offersData)) {
        const processedOffers = offersData.map(processOffer);
        allOffers = allOffers.concat(processedOffers);
        log += `Page ${pageNum} successful. Fetched ${processedOffers.length} offers. Total so far: ${allOffers.length}.\n`;
        
        nextPageUrl = data.offers?.next_page_url;

        if (nextPageUrl) {
           nextPageUrl += `&api_key=${apiKey}&pub_id=${pubId}&app_id=${appId}`;
        }
        
        if (!nextPageUrl) {
          log += 'No more pages to fetch.\n';
        }
        pageNum++;
      } else {
        log += `API call for page ${pageNum} was not successful. Status: ${data.status}, Message: ${data.message || 'No message'}. Response: ${JSON.stringify(data)}\n`;
        console.error(log);
        break;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during fetch.";
      log += `FATAL ERROR on page ${pageNum}: ${errorMessage}\n`;
      console.error(log);
      break; 
    }
  }
  log += `Sync finished. Total unique offers processed: ${allOffers.length}.\n`;
  return { offers: allOffers, log };
}
