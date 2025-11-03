
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createSupabaseAdminClient } from "@/utils/supabase/admin";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin: Manage Users",
  description: "View and manage all registered users.",
};

type UserProfile = {
  user_id: string;
  email: string | null;
  created_at: string;
  profile_id: string | null;
  points: number | null;
}

async function getAllUsers(): Promise<UserProfile[]> {
  const supabase = createSupabaseAdminClient();

  // Step 1: Fetch all users from auth.users
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError) {
    console.error("Error fetching users from auth:", usersError.message);
    return [];
  }
  
  // Step 2: Fetch all profiles from public.profiles
  const { data: profilesData, error: profilesError } = await supabase.from('profiles').select('id, user_id, points');
  if (profilesError) {
    console.error("Error fetching profiles:", profilesError.message);
    // Proceed with users even if profiles fail
  }

  // Step 3: Create a map of profiles for easy lookup
  const profilesMap = new Map<string, { id: string, points: number }>();
  if (profilesData) {
    for (const profile of profilesData) {
        if (profile.user_id) {
            profilesMap.set(profile.user_id, { id: profile.id, points: profile.points });
        }
    }
  }

  // Step 4: Combine the data
  const combinedData: UserProfile[] = usersData.users.map(user => {
    const profile = profilesMap.get(user.id);
    return {
      user_id: user.id,
      email: user.email || null,
      created_at: user.created_at,
      profile_id: profile?.id || null,
      points: profile?.points || 0,
    };
  });

  return combinedData;
}


export default async function ManageUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage Users"
        description={`A total of ${users.length} users have registered.`}
      />
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Profile ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">
                      {user.email ?? 'N/A'}
                    </TableCell>
                    <TableCell>{user.points ?? 0}</TableCell>
                    <TableCell>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.profile_id ?? 'No Profile'}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
