"use client";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import { SafeImage } from "./safe-image";

export function UserNav({ user, avatarUrl }: { user: SupabaseUser | null, avatarUrl: string | null }) {
  return (
    <div className="relative h-12 w-12 rounded-full overflow-hidden">
        <SafeImage
            src={avatarUrl || `https://picsum.photos/seed/${user?.id || 'avatar'}/64/64`}
            alt="User avatar"
            fill
            className="object-cover"
            data-ai-hint={"person portrait"}
        />
    </div>
  );
}
