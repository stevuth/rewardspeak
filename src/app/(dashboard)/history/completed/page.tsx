
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
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { QuestMap } from "@/components/illustrations/quest-map";

export const metadata: Metadata = {
  title: "Completed Offers",
  description: "Review your completed offers.",
};

type Offer = {
    id: string;
    title: string;
    partner: string;
    points: number;
    date?: string;
    status: "Completed" | "Pending" | "Rejected";
}

const StatusBadge = ({ status }: { status: Offer["status"] }) => {
  if (status === "Completed") {
    return (
      <Badge className="bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30">
        <CheckCircle className="mr-1 h-3 w-3" />
        Completed
      </Badge>
    );
  }
  return <Badge variant="secondary">{status}</Badge>;
};

export default function CompletedPage() {
  const completedOffers: Offer[] = [];

  return (
    <div className="space-y-8">
      <PageHeader
        description="A log of all quests you have successfully completed."
        icon={CheckCircle}
      />
      <Card>
        <CardContent className="pt-6">
          {completedOffers.length > 0 ? (
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
                {completedOffers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell className="font-medium">{offer.title}</TableCell>
                    <TableCell>{offer.partner}</TableCell>
                    <TableCell>{offer.date}</TableCell>
                    <TableCell>
                      <StatusBadge status={offer.status} />
                    </TableCell>
                    <TableCell
                      className={cn("text-right font-bold", "text-secondary")}
                    >
                      +
                      {offer.points.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <QuestMap />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
