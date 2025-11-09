
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
import { CheckCircle, Clock, XCircle, History } from "lucide-react";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { QuestMap } from "@/components/illustrations/quest-map";

export const metadata: Metadata = {
  title: "Offers Log",
  description: "Review your completed, pending, and rejected offers.",
};

const StatusBadge = ({ status }: { status: Offer["status"] }) => {
  if (status === "Completed") {
    return (
      <Badge className="bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30">
        <CheckCircle className="mr-1 h-3 w-3" />
        Completed
      </Badge>
    );
  }
  if (status === "Pending") {
    return (
      <Badge variant="outline" className="text-foreground border-border">
        <Clock className="mr-1 h-3 w-3" />
        Pending
      </Badge>
    );
  }
  if (status === "Rejected") {
    return (
      <Badge variant="destructive">
        <XCircle className="mr-1 h-3 w-3" />
        Rejected
      </Badge>
    );
  }
  return <Badge variant="secondary">{status}</Badge>;
};

const OfferHistoryTable = ({ offers, emptyState }: { offers: Offer[], emptyState?: React.ReactNode }) => {
  if (offers.length === 0) {
    return <>{emptyState}</>;
  }

  return (
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
        {offers.map((offer) => (
          <TableRow key={offer.id}>
            <TableCell className="font-medium">{offer.title}</TableCell>
            <TableCell>{offer.partner}</TableCell>
            <TableCell>{offer.date}</TableCell>
            <TableCell>
              <StatusBadge status={offer.status} />
            </TableCell>
            <TableCell
              className={cn("text-right font-bold", {
                "text-secondary": offer.status === "Completed",
                "text-muted-foreground": offer.status !== "Completed",
              })}
            >
              {offer.status === "Completed" ? "+" : ""}
              {offer.points.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function HistoryPage() {
  const offerHistory = popularOffers.sort(
    (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()
  );

  const inProgressOffers = offerHistory.filter(o => o.status === 'Pending');
  const completedOffers = offerHistory.filter(o => o.status === 'Completed');
  const allOffers = offerHistory;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Offers Log"
        description="Review your completed, pending, and rejected offers."
        icon={History}
      />
      <Card>
        <CardHeader>
           <PageHeader title="Offer History" description="A complete log of all quests you've embarked on." />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <OfferHistoryTable offers={allOffers} emptyState={<QuestMap />} />
            </TabsContent>
            <TabsContent value="in-progress">
               <OfferHistoryTable offers={inProgressOffers} emptyState={<QuestMap />} />
            </TabsContent>
            <TabsContent value="completed">
               <OfferHistoryTable offers={completedOffers} emptyState={<QuestMap />} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
