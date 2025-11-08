
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

    // Fetch all users from both auth and profiles table, joining them.
    const { data: users, error } = await supabase
        .from('profiles')
        .select(`
            user_id,
            id,
            points,
            withdrawn,
            referral_earnings,
            country_code,
            avatar_url,
            users (
                email,
                created_at,
                last_sign_in_at
            )
        `)
        .order('created_at', { foreignTable: 'users', ascending: false });

    if (error) {
      console.error("Error fetching users and profiles:", error.message);
      throw error;
    }
    
    // Transform the data into the desired UserProfile shape
    const combinedData: UserProfile[] = users.map(p => {
        const userAuthData = Array.isArray(p.users) ? p.users[0] : p.users;
        return {
            user_id: p.user_id,
            email: userAuthData?.email || null,
            created_at: userAuthData?.created_at || new Date().toISOString(),
            last_sign_in_at: userAuthData?.last_sign_in_at || null,
            profile_id: p.id,
            points: p.points,
            withdrawn: p.withdrawn,
            referral_earnings: p.referral_earnings,
            country_code: p.country_code,
            avatar_url: p.avatar_url,
        }
    });
    
    return NextResponse.json({ users: combinedData });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch users.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
