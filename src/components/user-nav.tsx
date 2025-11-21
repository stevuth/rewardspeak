
"use client";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function UserNav({ user, avatarUrl }: { user: SupabaseUser | null, avatarUrl: string | null }) {
  const fallbackText = user?.email ? user.email.charAt(0).toUpperCase() : 'U';
  const [unreadCount, setUnreadCount] = useState(0);

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

      const count = tickets.reduce((acc, ticket) => {
        const lastMessage = ticket.messages[ticket.messages.length - 1];
        // If the last message is from support, we consider it unread for the user
        if (lastMessage && lastMessage.is_from_support) {
          return acc + 1;
        }
        return acc;
      }, 0);

      setUnreadCount(count);
    };

    fetchUnreadStatus();

    const channel = supabase
      .channel(`public:support_tickets:user_id=eq.${user.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'support_tickets', filter: `user_id=eq.${user.id}` },
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
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 border-2 border-background flex items-center justify-center z-10">
          <span className="text-[10px] font-bold text-white leading-none">{unreadCount > 9 ? '9+' : unreadCount}</span>
        </div>
      )}
    </Link>
  );
}
