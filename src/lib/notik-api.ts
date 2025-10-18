
export interface NotikOffer {
  offer_id: string;
  name: string;
  description: string;
  click_url: string;
  image_url: string;
  network: string;
  payout: number; // Changed from payout_usd: string
  payout_usd?: string; // Keep for backward compatibility if needed
  countries: string[];
  platforms: ('ios' | 'android' | 'desktop' | 'all')[];
  categories: string[];
  events?: { id: number, name: string, payout: number }[];
}

interface ApiOfferResponse {
  data: NotikOffer[];
  next_page_url?: string | null;
  // Other pagination properties if they exist
}

interface ApiResponse {
  status: string;
  code?: string;
  message?: string;
  offers?: ApiOfferResponse; // This contains the nested data array
  data?: { // Keep this for the previous structure attempt, just in case
    offers: NotikOffer[];
    next_page_url?: string | null;
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

    if (data.status === 'success' && data.offers?.data) {
       // The offers are nested inside offers.data
      return data.offers.data.map(offer => ({
        ...offer,
        payout: offer.payout_usd ? parseFloat(offer.payout_usd) : offer.payout, // Ensure payout is a number
        payout_usd: offer.payout_usd || String(offer.payout)
      }));
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

      if (data.status === 'success' && data.offers?.data) {
        const offers = data.offers.data.map(offer => ({
          ...offer,
          payout: offer.payout_usd ? parseFloat(offer.payout_usd) : offer.payout,
          payout_usd: offer.payout_usd || String(offer.payout)
        }));
        allOffers = allOffers.concat(offers);
        nextPageUrl = data.offers.next_page_url;
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
