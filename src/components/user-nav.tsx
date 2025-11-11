
"use client";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function UserNav({ user, avatarUrl }: { user: SupabaseUser | null, avatarUrl: string | null }) {
  const fallbackText = user?.email ? user.email.charAt(0).toUpperCase() : 'U';
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const supabase = createSupabaseBrowserClient();
    const fetchUnreadStatus = async () => {
        const { data: tickets, error } = await supabase
            .from('support_tickets')
            .select('id, messages:ticket_messages!inner(is_from_support)')
            .eq('user_id', user.id)
            .eq('status', 'open');

        if (error || !tickets) {
            console.error("Error fetching unread status:", error);
            return;
        };

        const hasUnread = tickets.some(ticket => 
            ticket.messages.length > 0 && ticket.messages[ticket.messages.length - 1].is_from_support
        );
        setHasUnreadMessages(hasUnread);
    };
    
    fetchUnreadStatus();

    const channel = supabase
        .channel(`public:ticket_messages:user_id=eq.${user.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ticket_messages' }, 
            (payload) => {
                fetchUnreadStatus();
            }
        ).subscribe();

    return () => {
        supabase.removeChannel(channel);
    }
  }, [user]);
  
  return (
    <Link href="/help" className="relative">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl || ''} alt="User avatar" />
        <AvatarFallback>{fallbackText}</AvatarFallback>
      </Avatar>
      {hasUnreadMessages && (
        <div className="absolute top-0 right-0 -mr-1 -mt-1 h-5 w-5 rounded-full bg-destructive border-2 border-background flex items-center justify-center">
            <Bell className="h-3 w-3 text-destructive-foreground" />
        </div>
      )}
    </Link>
  );
}
