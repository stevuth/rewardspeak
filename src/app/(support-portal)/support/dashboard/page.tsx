
'use client';

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WavingMascotLoader } from "@/components/waving-mascot-loader";
import { useState } from "react";
import { Inbox, FileText, Archive, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Mock data for demonstration
const mockTickets = [
  { id: 'TKT-001', subject: 'Issue with PayPal withdrawal', user: 'user1@example.com', status: 'Open', date: '2024-07-30T10:00:00Z', priority: 'High', messages: [{from: 'user', text: 'I tried to withdraw $10 to my PayPal but it failed. Can you help?'}, {from: 'admin', text: 'Certainly, looking into it now.'}] },
  { id: 'TKT-002', subject: 'Offer not crediting points', user: 'user2@example.com', status: 'Open', date: '2024-07-29T14:30:00Z', priority: 'Medium', messages: [{from: 'user', text: 'I completed the "State of Survival" offer but did not receive my 5000 points.'}] },
  { id: 'TKT-003', subject: 'Question about referral earnings', user: 'user3@example.com', status: 'Closed', date: '2024-07-28T09:00:00Z', priority: 'Low', messages: [{from: 'user', text: 'How is the 10% referral commission calculated?'}] },
];

type Ticket = typeof mockTickets[0];

export default function SupportDashboardPage() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(mockTickets[0]);

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge variant="secondary">Medium</Badge>;
      default: return <Badge variant="outline">Low</Badge>;
    }
  }

  const getStatusBadge = (status: string) => {
    return status === 'Open' ? <Badge className="bg-green-500">Open</Badge> : <Badge variant="secondary">Closed</Badge>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Support Center"
        description="Respond to user inquiries and manage support tickets."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-220px)]">
        {/* Tickets List */}
        <div className="lg:col-span-1 h-full flex flex-col">
          <Card className="flex-grow flex flex-col">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Inbox className="h-5 w-5"/> Inbox</CardTitle>
              <Badge variant="secondary">{mockTickets.filter(t => t.status === 'Open').length} Open</Badge>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto p-2">
              <div className="space-y-2">
                {mockTickets.map(ticket => (
                  <button key={ticket.id} onClick={() => setSelectedTicket(ticket)} className={`w-full text-left p-3 rounded-lg transition-colors ${selectedTicket?.id === ticket.id ? 'bg-muted' : 'hover:bg-muted/50'}`}>
                    <div className="flex justify-between items-start">
                        <p className="font-semibold text-sm truncate pr-2">{ticket.subject}</p>
                        {getStatusBadge(ticket.status)}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                      <p className="truncate pr-2">{ticket.user}</p>
                      <span>{new Date(ticket.date).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
             <CardFooter className="p-2 border-t justify-between">
                <Button variant="ghost" size="icon"><ChevronLeft /></Button>
                <span className="text-sm text-muted-foreground">1 of 10</span>
                <Button variant="ghost" size="icon"><ChevronRight /></Button>
            </CardFooter>
          </Card>
        </div>

        {/* Ticket Viewer */}
        <div className="lg:col-span-2 h-full flex flex-col">
          <Card className="flex-grow flex flex-col">
            {selectedTicket ? (
              <>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getPriorityBadge(selectedTicket.priority)}
                        <span className="text-xs text-muted-foreground">{selectedTicket.id}</span>
                      </div>
                      <CardTitle>{selectedTicket.subject}</CardTitle>
                      <CardDescription>From: {selectedTicket.user}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">Close Ticket</Button>
                        <Button variant="destructive" size="sm">Ban User</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto space-y-4">
                  {selectedTicket.messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md p-3 rounded-lg ${msg.from === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="p-4 border-t">
                  <div className="w-full flex items-center gap-2">
                    <Textarea placeholder="Type your response..." className="flex-grow"/>
                    <Button size="icon"><Send className="h-4 w-4"/></Button>
                    <Button variant="secondary">Templates</Button>
                  </div>
                </CardFooter>
              </>
            ) : (
              <CardContent className="flex flex-col items-center justify-center h-full text-center">
                <WavingMascotLoader text="Select a ticket to view" />
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
