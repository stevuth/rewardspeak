
'use client';

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useTransition, useRef } from 'react';
import { createSupportTicket, addSupportReply } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Mail, Inbox, MessageSquare } from 'lucide-react';
import { WavingMascotLoader } from "@/components/waving-mascot-loader";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "@supabase/supabase-js";

type TicketMessage = {
  id: string;
  created_at: string;
  ticket_id: string;
  user_id: string;
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

export default function HelpPage() {
  const [view, setView] = useState<'list' | 'create' | 'ticket'>('list');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReplying, startReplyTransition] = useTransition();
  const [replyMessage, setReplyMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('support_tickets')
          .select('*, messages:ticket_messages(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          toast({ variant: 'destructive', title: 'Error', description: 'Could not load your support tickets.' });
        } else {
          setTickets(data as Ticket[]);
        }
      }
      setIsLoading(false);
    };
    fetchInitialData();
  }, [supabase, toast]);

  useEffect(() => {
    if (!selectedTicket) return;

    const channel = supabase
      .channel(`ticket-messages-${selectedTicket.id}`)
      .on<TicketMessage>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${selectedTicket.id}` },
        (payload) => {
          setSelectedTicket(prev => {
            if (!prev) return null;
            // Avoid adding duplicate messages
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

  const handleSendReply = () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    startReplyTransition(async () => {
      const result = await addSupportReply({
        ticket_id: selectedTicket.id,
        message: replyMessage,
        isFromSupport: false
      });

      if (result.success && result.data) {
        setReplyMessage('');
        // Optimistically add message, but Supabase real-time should handle it.
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not send reply.' });
      }
    });
  };

  const handleCreateTicket = async (formData: FormData) => {
    startReplyTransition(async () => {
      const result = await createSupportTicket(formData);
      if (result.success) {
        toast({ title: 'Ticket Created', description: 'We have received your message.' });
        const { data } = await supabase.from('support_tickets').select('*, messages:ticket_messages(*)').eq('id', result.ticketId).single();
        if (data) {
            setTickets(prev => [data as Ticket, ...prev]);
            setSelectedTicket(data as Ticket);
            setView('ticket');
        } else {
            setView('list');
        }
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    });
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-96">
            <WavingMascotLoader text="Loading Help Center..." />
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Help Center"
        description="Get help or create a new support ticket."
      />

      {view === 'list' && (
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2"><Inbox className="h-5 w-5" /> Your Tickets</CardTitle>
              <CardDescription>A list of your support conversations.</CardDescription>
            </div>
            <Button onClick={() => setView('create')}>New Ticket</Button>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    You have no support tickets.
                </div>
            ) : (
                <div className="space-y-2">
                    {tickets.map(ticket => (
                        <button key={ticket.id} onClick={() => { setSelectedTicket(ticket); setView('ticket'); }} className="w-full text-left p-3 rounded-lg transition-colors hover:bg-muted">
                            <div className="flex justify-between items-start">
                                <p className="font-semibold">{ticket.subject}</p>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${ticket.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-muted-foreground/20 text-muted-foreground'}`}>{ticket.status}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{new Date(ticket.created_at).toLocaleString()}</p>
                        </button>
                    ))}
                </div>
            )}
          </CardContent>
        </Card>
      )}

      {view === 'create' && (
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5"/> Create a New Ticket</CardTitle>
              <CardDescription>Fill out the form below to contact support.</CardDescription>
          </CardHeader>
          <form action={handleCreateTicket}>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" required className="min-h-[120px]" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="attachment">Attach Image (Optional)</Label>
                    <Input id="attachment" name="attachment" type="file" accept="image/*" />
                </div>
            </CardContent>
            <CardFooter className="gap-2">
                <Button type="submit" disabled={isReplying}>
                    {isReplying ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4" />}
                    Send
                </Button>
                <Button variant="outline" onClick={() => setView('list')}>Back to Tickets</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {view === 'ticket' && selectedTicket && (
        <Card className="flex flex-col h-[70vh]">
            <CardHeader className="flex-shrink-0">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{selectedTicket.subject}</CardTitle>
                        <CardDescription>Ticket ID: {selectedTicket.id}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setView('list')}>Back to Tickets</Button>
                </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto space-y-4">
                {selectedTicket.messages.sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map(msg => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.is_from_support ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-md p-3 rounded-lg ${msg.is_from_support ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter className="p-4 border-t gap-2">
                <Textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} placeholder="Type your reply..." disabled={isReplying} />
                <Button onClick={handleSendReply} disabled={isReplying || !replyMessage.trim()}>
                    {isReplying ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4" />}
                </Button>
            </CardFooter>
        </Card>
      )}

    </div>
  );
}
