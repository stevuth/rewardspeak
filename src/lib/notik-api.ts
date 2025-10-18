export interface NotikOffer {
  offer_id: string;
  name: string;
  description: string;
  click_url: string;
  image_url: string;
  network: string;
  payout_usd: string;
  countries: string[];
  platforms: ('ios' | 'android' | 'desktop')[];
  categories: string[];
}

interface ApiResponse {
  status: string;
  message: string;
  data?: {
    offers: NotikOffer[];
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
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`API call failed with status: ${response.status}`);
      return [];
    }
    const data: ApiResponse = await response.json();

    if (data.status === 'success' && data.data?.offers) {
      return data.data.offers;
    } else {
      console.error("API call was not successful:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch offers:", error);
    return [];
  }
}
