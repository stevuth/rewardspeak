import { MetadataRoute } from 'next'
import { getAllOffers } from '@/lib/notik-api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://rewardspeak.com'

    // Static routes
    const routes = [
        '',
        '/join',
        '/auth/login',
        '/about-rewards-peak',
        '/terms-of-the-peak',
        '/privacy-trail',
        '/climb-and-earn',
        '/help',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }))

    // Fetch dynamic offers
    let offerRoutes: MetadataRoute.Sitemap = []

    try {
        const { offers } = await getAllOffers()

        offerRoutes = offers.map((offer) => ({
            url: `${baseUrl}/offer/${offer.offer_id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))
    } catch (error) {
        console.error('Failed to fetch offers for sitemap:', error)
    }

    return [...routes, ...offerRoutes]
}
