import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/support/', '/dashboard/settings', '/auth/'],
        },
        sitemap: 'https://rewardspeak.com/sitemap.xml',
    }
}
