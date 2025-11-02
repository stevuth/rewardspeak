
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
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { SafeImage } from "@/components/safe-image";

export const metadata: Metadata = {
  title: "Admin: Manage Offers",
  description: "View and manage all offers in the database.",
};

const OFFERS_PER_PAGE = 20;

async function getPaginatedOffers(page: number = 1) {
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
  return { offers: data, count: count || 0 };
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
                <TableHead className="w-16">Image</TableHead>
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>Countries</TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Offer ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.length > 0 ? (
                offers.map((offer) => (
                  <TableRow key={offer.offer_id}>
                    <TableCell>
                        <SafeImage src={offer.image_url} alt={offer.name} width={40} height={40} className="rounded-md object-cover" />
                    </TableCell>
                    <TableCell className="font-medium">{offer.name}</TableCell>
                    <TableCell>{offer.network}</TableCell>
                    <TableCell>${offer.payout.toFixed(2)}</TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                            {(offer.countries || []).map((country: string) => <Badge key={country}>{country}</Badge>)}
                        </div>
                    </TableCell>
                    <TableCell>
                         <div className="flex flex-wrap gap-1">
                            {(offer.platforms || []).map((platform: string) => <Badge variant="secondary" key={platform}>{platform}</Badge>)}
                        </div>
                    </TableCell>
                    <TableCell>
                         <div className="flex flex-wrap gap-1">
                            {(offer.categories || []).map((category: string) => <Badge variant="outline" key={category}>{category}</Badge>)}
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="secondary">{offer.offer_id}</Badge>
                    </TableCell>
                  </TableRow>
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
                    Showing {offers.length} of {count} offers
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
