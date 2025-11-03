
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { OfferDetailsRow } from "./offer-details-row";

export const metadata: Metadata = {
  title: "Admin: Manage Offers",
  description: "View and manage all offers in the database.",
};

const OFFERS_PER_PAGE = 20;

// Explicitly type the Offer object based on the database schema
type Offer = {
  offer_id: string;
  name: string;
  description: string;
  click_url: string;
  image_url: string;
  network: string;
  payout: number;
  countries: string[];
  platforms: string[];
  categories: string[];
  events: { id: number; name: string; payout: number }[];
  created_at: string;
};

async function getPaginatedOffers(page: number = 1): Promise<{ offers: Offer[], count: number }> {
  const supabase = createSupabaseServerClient();
  const from = (page - 1) * OFFERS_PER_PAGE;
  const to = from + OFFERS_PER_PAGE - 1;

  const { data, error, count } = await supabase
    .from('all_offers')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching offers:", error);
    return { offers: [], count: 0 };
  }
  // Cast the data to the Offer[] type to ensure type safety
  return { offers: data as Offer[], count: count || 0 };
}

export default async function ManageOffersPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const { offers, count } = await getPaginatedOffers(currentPage);
  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage Offers"
        description={`Showing page ${currentPage} of ${totalPages}. Total offers: ${count}.`}
      />
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 font-semibold">Image</TableHead>
                <TableHead className="w-[300px] font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Network</TableHead>
                <TableHead className="font-semibold">Payout</TableHead>
                <TableHead className="font-semibold">Countries</TableHead>
                <TableHead className="font-semibold">Platforms</TableHead>
                <TableHead className="font-semibold">Categories</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.length > 0 ? (
                offers.map((offer) => (
                  <OfferDetailsRow key={offer.offer_id} offer={offer} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    No offers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
            <div className="flex w-full justify-between items-center text-sm text-muted-foreground">
                <div>
                    Showing {((currentPage - 1) * OFFERS_PER_PAGE) + 1} - {Math.min(currentPage * OFFERS_PER_PAGE, count)} of {count} offers
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" disabled={currentPage <= 1}>
                        <Link href={`/admin/offers?page=${currentPage - 1}`}>
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Previous
                        </Link>
                    </Button>
                    <Button asChild variant="outline" disabled={currentPage >= totalPages}>
                         <Link href={`/admin/offers?page=${currentPage + 1}`}>
                            Next
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
