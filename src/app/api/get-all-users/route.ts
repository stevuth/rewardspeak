
import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from "@/utils/supabase/admin";

export type UserProfile = {
  user_id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  profile_id: string | null; // referral code
  points: number | null;
  withdrawn: number | null;
  referral_earnings: number | null;
  country_code: string | null;
  avatar_url: string | null;
}

// This API route uses the admin client to securely fetch all users.
export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    // 1. Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError.message);
      throw profilesError;
    }

    // 2. Fetch all users from auth schema
    const { data: authUsersResponse, error: authUsersError } = await supabase.auth.admin.listUsers();

    if (authUsersError) {
        console.error("Error fetching auth users:", authUsersError.message);
        throw authUsersError;
    }
    
    // Create a map of auth users by their ID for efficient lookup
    const authUsersMap = new Map(authUsersResponse.users.map(user => [user.id, user]));

    // 3. Combine the data
    const combinedData: UserProfile[] = profiles.map(profile => {
      const authUser = authUsersMap.get(profile.user_id);
      return {
        user_id: profile.user_id,
        email: authUser?.email || null,
        created_at: authUser?.created_at || profile.created_at, // Fallback to profile creation time
        last_sign_in_at: authUser?.last_sign_in_at || null,
        profile_id: profile.id,
        points: profile.points,
        withdrawn: profile.withdrawn,
        referral_earnings: profile.referral_earnings,
        country_code: profile.country_code,
        avatar_url: profile.avatar_url,
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); // Sort by creation date descending
    
    return NextResponse.json({ users: combinedData });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch users.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
