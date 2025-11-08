
"use client";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SafeImage } from "./safe-image";

export function UserNav({ user, avatarUrl }: { user: SupabaseUser | null, avatarUrl: string | null }) {
  const fallbackText = user?.email ? user.email.charAt(0).toUpperCase() : 'U';
  
  return (
    <Avatar className="h-10 w-10">
      <AvatarImage src={avatarUrl || ''} alt="User avatar" />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  );
}
