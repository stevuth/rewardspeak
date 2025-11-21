import { getAllOffers, NotikOffer } from '@/lib/notik-api';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Props = {
    params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { offers } = await getAllOffers();
    const offer = offers.find(o => o.offer_id === params.id);

    if (!offer) {
        return {
            title: 'Offer Not Found',
        }
    }

    return {
        title: `${offer.name} - Earn Rewards | Rewards Peak`,
        description: offer.description || `Complete the ${offer.name} offer to earn rewards on Rewards Peak.`,
        openGraph: {
            title: `${offer.name} - Earn Rewards`,
            description: offer.description,
            images: [offer.image_url],
        },
    }
}

export async function generateStaticParams() {
    const { offers } = await getAllOffers();
    return offers.map((offer) => ({
        id: offer.offer_id,
    }))
}

export default async function OfferPage({ params }: Props) {
    const { offers } = await getAllOffers();
    const offer = offers.find(o => o.offer_id === params.id);

    if (!offer) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Offer",
        name: offer.name,
        description: offer.description,
        image: offer.image_url,
        url: `https://rewardspeak.com/offer/${offer.offer_id}`,
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        seller: {
            "@type": "Organization",
            name: "Rewards Peak"
        }
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="max-w-2xl mx-auto bg-card border rounded-xl overflow-hidden shadow-lg">
                <div className="relative h-64 w-full bg-muted">
                    <Image
                        src={offer.image_url}
                        alt={offer.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">{offer.name}</h1>
                        <p className="text-muted-foreground mt-2">{offer.network}</p>
                    </div>

                    <div className="prose dark:prose-invert">
                        <p>{offer.description}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button asChild size="lg" className="w-full sm:w-auto">
                            <a href={offer.click_url} target="_blank" rel="noopener noreferrer">
                                Start Offer
                            </a>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                            <Link href="/earn">
                                Back to Earn
                            </Link>
                        </Button>
                    </div>

                    <div className="text-sm text-muted-foreground pt-4 border-t">
                        <p>Payout: {offer.payout} Points</p>
                        <p>Devices: {offer.devices.join(', ') || 'All'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
