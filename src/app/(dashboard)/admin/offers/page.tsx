
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
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

export const metadata: Metadata = {
  title: "Admin: Manage Offers",
  description: "View and manage all offers in the database.",
};

async function getAllOffers() {
  const supabase = createSupabaseServerClient();
  // Supabase has a default limit of 1000 rows. We'll fetch a large number for the admin page.
  const { data, error, count } = await supabase
    .from('all_offers')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(5000);

  if (error) {
    console.error("Error fetching offers:", error);
    return { offers: [], count: 0 };
  }
  return { offers: data, count: count || 0 };
}

export default async function ManageOffersPage() {
  const { offers, count } = await getAllOffers();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage Offers"
        description={`Showing ${offers.length} of ${count} total offers in the database.`}
      />
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>Countries</TableHead>
                <TableHead>Offer ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.length > 0 ? (
                offers.map((offer) => (
                  <TableRow key={offer.offer_id}>
                    <TableCell className="font-medium">{offer.name}</TableCell>
                    <TableCell>{offer.network}</TableCell>
                    <TableCell>${offer.payout.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge>{offer.countries.join(', ')}</Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant="secondary">{offer.offer_id}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No offers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
