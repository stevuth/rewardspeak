
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
import { useState, useEffect, useTransition } from "react";
import { Inbox, Send, ChevronLeft, ChevronRight, Loader2, Paperclip, Bot } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { getSupportTickets, addSupportReply, getTicketTemplates } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

type TicketMessage = {
  id: string;
  created_at: string;
  ticket_id: string;
  user_id: string; // ID of the user who sent the message
  message: string;
  is_from_support: boolean;
  attachment_url: string | null;
};

type Ticket = {
  id: string;
  created_at: string;
  user_id: string;
  user_email: string;
  subject: string;
  status: "open" | "closed";
  priority: "low" | "medium" | "high";
  messages: TicketMessage[];
};

export default function SupportDashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, startReplyTransition] = useTransition();
  const [templates, setTemplates] = useState<{ title: string; content: string }[]>([]);
  const { toast } = useToast();
  const supabase = createSupabaseBrowserClient();

  const fetchTickets = async (selectFirst: boolean = false) => {
      const result = await getSupportTickets();
      if (result.success && result.data) {
        setTickets(result.data);
        if (selectFirst && result.data.length > 0 && !selectedTicket) {
            setSelectedTicket(result.data[0]);
        } else if (selectedTicket) {
            const updatedTicket = result.data.find(t => t.id === selectedTicket.id);
            if (updatedTicket) {
                setSelectedTicket(updatedTicket);
            }
        }
      } else {
        toast({
            variant: "destructive",
            title: "Failed to load tickets",
            description: result.error,
        });
      }
      setIsLoading(false);
  }

  useEffect(() => {
    setIsLoading(true);
    fetchTickets(true); // Initially fetch and select the first ticket
    
    async function fetchTemplates() {
        const tpl = await getTicketTemplates();
        setTemplates(tpl);
    }
    fetchTemplates();
  }, [toast]);

  useEffect(() => {
    if (!selectedTicket) return;

    const channel = supabase
      .channel(`ticket-messages-${selectedTicket.id}`)
      .on<TicketMessage>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${selectedTicket.id}` },
        (payload) => {
          // Add the new message to the state if it's not already there
          setSelectedTicket(prev => {
            if (!prev) return null;
            if (prev.messages.some(msg => msg.id === payload.new.id)) {
                return prev;
            }
            return {
              ...prev,
              messages: [...prev.messages, payload.new]
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedTicket, supabase]);

  const handleSendReply = async () => {
      if (!selectedTicket || !replyMessage.trim()) return;

      startReplyTransition(async () => {
        const result = await addSupportReply({
            ticket_id: selectedTicket.id,
            message: replyMessage,
            isFromSupport: true
        });

        if (result.success) {
            setReplyMessage('');
            // Optimistically add the message to the UI, real-time should confirm
             if (result.data) {
                setSelectedTicket(prev => prev ? { ...prev, messages: [...prev.messages, result.data as TicketMessage] } : null);
             }
        } else {
            toast({
                variant: 'destructive',
                title: 'Reply Failed',
                description: result.error,
            });
        }
      });
  }

  const handleTemplateClick = (content: string) => {
    setReplyMessage(content);
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge variant="secondary">Medium</Badge>;
      default: return <Badge variant="outline">Low</Badge>;
    }
  }

  const getStatusBadge = (status: string) => {
    return status === 'open' ? <Badge className="bg-green-500">Open</Badge> : <Badge variant="secondary">Closed</Badge>;
  }

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-220px)]">
            <WavingMascotLoader text="Loading Tickets..." />
        </div>
    )
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
              <Badge variant="secondary">{tickets.filter(t => t.status === 'open').length} Open</Badge>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto p-2">
              <div className="space-y-2">
                {tickets.length > 0 ? (
                    tickets.map(ticket => (
                    <button key={ticket.id} onClick={() => setSelectedTicket(ticket)} className={`w-full text-left p-3 rounded-lg transition-colors ${selectedTicket?.id === ticket.id ? 'bg-muted' : 'hover:bg-muted/50'}`}>
                        <div className="flex justify-between items-start">
                            <p className="font-semibold text-sm truncate pr-2">{ticket.subject}</p>
                            {getStatusBadge(ticket.status)}
                        </div>
                        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                        <p className="truncate pr-2">{ticket.user_email}</p>
                        <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                    </button>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                        No tickets yet.
                    </div>
                )}
              </div>
            </CardContent>
             <CardFooter className="p-2 border-t justify-between">
                <Button variant="ghost" size="icon"><ChevronLeft /></Button>
                <span className="text-sm text-muted-foreground">1 of 1</span>
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
                      <CardDescription>From: {selectedTicket.user_email}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">Close Ticket</Button>
                        <Button variant="destructive" size="sm">Ban User</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto space-y-4">
                  {selectedTicket.messages.sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((msg, index) => (
                    <div key={index} className={`flex ${msg.is_from_support ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md p-3 rounded-lg ${msg.is_from_support ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                        {msg.attachment_url && (
                          <div className="mt-2">
                            <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" className="relative block w-48 h-48">
                              <img src={msg.attachment_url} alt="Attachment" className="rounded-md object-cover w-full h-full" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="p-4 border-t">
                  <div className="w-full flex items-center gap-2">
                    <Textarea 
                        placeholder="Type your response..." 
                        className="flex-grow"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        disabled={isReplying}
                    />
                    <Button size="icon" onClick={handleSendReply} disabled={isReplying || !replyMessage.trim()}>
                        {isReplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4"/>}
                    </Button>
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="secondary" disabled={isReplying}>Templates</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none flex items-center gap-2"><Bot className="h-4 w-4"/> Response Templates</h4>
                                    <p className="text-sm text-muted-foreground">
                                    Select a pre-written response to quickly answer common questions.
                                    </p>
                                </div>
                                <div className="grid gap-2">
                                    {templates.map((template, index) => (
                                        <Button
                                            key={index}
                                            variant="ghost"
                                            className="justify-start"
                                            onClick={() => handleTemplateClick(template.content)}
                                        >
                                            {template.title}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                  </div>
                </CardFooter>
              </>
            ) : (
              <CardContent className="flex flex-col items-center justify-center h-full text-center">
                 {tickets.length > 0 ? (
                    <WavingMascotLoader text="Select a ticket to view" />
                 ) : (
                    <div className="text-muted-foreground">
                        <Inbox className="h-16 w-16 mx-auto mb-4" />
                        <p className="font-semibold">The inbox is empty!</p>
                        <p>New tickets from users will appear here.</p>
                    </div>
                 )}
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
