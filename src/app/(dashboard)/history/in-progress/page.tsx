
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { popularOffers, type Offer } from "@/lib/mock-data";
import { Clock } from "lucide-react";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "In Progress Quests",
  description: "Review your pending offers.",
};

const StatusBadge = ({ status }: { status: Offer["status"] }) => {
  if (status === "Pending") {
    return (
      <Badge variant="outline" className="text-yellow-400 border-yellow-600/30">
        <Clock className="mr-1 h-3 w-3" />
        Pending
      </Badge>
    );
  }
  return <Badge variant="secondary">{status}</Badge>;
};

export default function InProgressPage() {
  const inProgressOffers = popularOffers
    .filter((o) => o.status === "Pending")
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());

  return (
    <div className="space-y-8">
      <PageHeader
        title="In Progress Quests"
        description="A log of all quests that are currently pending."
      />
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quest</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inProgressOffers.length > 0 ? (
                inProgressOffers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell className="font-medium">{offer.title}</TableCell>
                    <TableCell>{offer.partner}</TableCell>
                    <TableCell>{offer.date}</TableCell>
                    <TableCell>
                      <StatusBadge status={offer.status} />
                    </TableCell>
                    <TableCell
                      className={cn("text-right font-bold", "text-muted-foreground")}
                    >
                      {offer.points.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No offers in progress. Start a quest!
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
