export interface WannadsOffer {
    id: string;
    campaign_name: string;
    description: string;
    url: string;
    icon: string;
    payout: string;
    countries: string[];
    device: string;
    category: string;
}

interface ApiResponse {
    status: string;
    message?: string;
    offers?: WannadsOffer[];
}

export async function getWannadsOffers(userId: string, userIp: string): Promise<WannadsOffer[]> {
    const apiKey = process.env.WANNADS_API_KEY;
    const apiSecret = process.env.WANNADS_API_SECRET;

    if (!apiKey || !apiSecret) {
        console.error("Wannads API credentials are not set in environment variables.");
        return [];
    }

    const apiUrl = `https://platform.wannads.com/api/offerwall/offers?apiKey=${apiKey}&apiSecret=${apiSecret}&userId=${userId}&ip=${userIp}`;

    try {
        const response = await fetch(apiUrl, { next: { revalidate: 900 } }); // Revalidate every 15 minutes
        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Wannads API call failed with status: ${response.status}`, errorBody);
            return [];
        }

        const data: WannadsOffer[] | ApiResponse = await response.json();

        // The API returns an array directly on success, and an object on failure.
        if (Array.isArray(data)) {
            return data;
        } else if (data.status && data.status !== 'success') {
            console.error("Wannads API returned an error:", data.message);
            return [];
        }

        return [];
    } catch (error) {
        console.error("Failed to fetch Wannads offers:", error);
        return [];
    }
}
