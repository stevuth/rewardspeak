
import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from "@/utils/supabase/admin";

type UserProfile = {
  user_id: string;
  email: string | null;
  created_at: string;
  profile_id: string | null;
  points: number | null;
}

// This API route uses the admin client to securely fetch all users.
export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    const { data: authUsers, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) {
      console.error("Error fetching users from auth:", usersError.message);
      throw usersError;
    }
    
    const { data: profiles, error: profilesError } = await supabase.from('profiles').select('id, user_id, points');
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError.message);
      // We can continue without profiles if it fails, but we'll have less data
    }

    const profilesMap = new Map<string, { id: string, points: number }>();
    if (profiles) {
      for (const profile of profiles) {
          if (profile.user_id) {
              profilesMap.set(profile.user_id, { id: profile.id, points: profile.points ?? 0 });
          }
      }
    }

    const combinedData: UserProfile[] = authUsers.users.map(user => {
      const profile = profilesMap.get(user.id);
      return {
        user_id: user.id,
        email: user.email || null,
        created_at: user.created_at,
        profile_id: profile?.id || null,
        points: profile?.points || 0,
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return NextResponse.json({ users: combinedData });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch users.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

