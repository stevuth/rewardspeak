// supabase/functions/_shared/notik-api.ts

// The types defined here should match the shape of the data from the Notik API.
// It's important for ensuring data consistency when fetching and processing offers.
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

interface RawNotikOffer extends Omit<NotikOffer, 'payout' | 'countries' | 'description' | 'devices' | 'platforms'> {
  payout?: number | string;
  country_code: any;
  devices: any;
  os: any;
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
    if (keys.length === 0) return ["ALL"];
    const isCountryCodeKey = keys.every(key => /^[A-Z]{2}$/.test(key.toUpperCase()));
    if (isCountryCodeKey) return keys.map(k => k.toUpperCase());

    const values = Object.values(rawCountryCode).map(String).filter(Boolean);
    if (values.length > 0) return values.map(v => v.toUpperCase());
  }

  return ["ALL"];
}

function processOffer(rawOffer: RawNotikOffer): NotikOffer {
  const payoutValue = typeof rawOffer.payout === 'string' ? parseFloat(rawOffer.payout) : (rawOffer.payout || 0);
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

export async function getAllOffers(): Promise<{ offers: NotikOffer[], log: string }> {
  const apiKey = Deno.env.get("NOTIK_API_KEY");
  const pubId = Deno.env.get("NOTIK_PUB_ID");
  const appId = Deno.env.get("NOTIK_APP_ID");
  let log = '';

  if (!apiKey || !pubId || !appId) {
    log = "CRITICAL ERROR: Notik API secrets (NOTIK_API_KEY, NOTIK_PUB_ID, NOTIK_APP_ID) are not set in the Supabase Edge Function secrets.\n";
    console.error(log);
    return { offers: [], log };
  }

  let allOffers: NotikOffer[] = [];
  let pageNum = 1;
  let nextPageUrl: string | null | undefined = `https://notik.me/api/v2/get-offers/all?api_key=${apiKey}&pub_id=${pubId}&app_id=${appId}`;
  const headers = { 'Accept': 'application/json', 'User-Agent': 'Deno/1.x (Supabase Edge Function)' };

  log += `Starting server-side offer sync from Edge Function...\n`;

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
      log += `FATAL ERROR on page ${pageNum}: ${error.message}\n`;
      break;
    }
  }
  log += `Server sync finished. Total unique offers: ${allOffers.length}.\n`;
  return { offers: allOffers, log };
}
