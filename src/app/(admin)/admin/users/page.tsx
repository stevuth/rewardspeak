
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
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin: Manage Users",
  description: "View and manage all registered users.",
};

// We define a type for the joined data for better type safety.
// This now reflects the structure returned by our SQL function.
type UserProfile = {
    profile_id: string;
    user_id: string;
    points: number;
    email: string | null;
    created_at: string;
}

async function getAllUsers(): Promise<UserProfile[]> {
  const supabase = createSupabaseServerClient();
  
  // Create the SQL function first
  const functionQuery = `
    CREATE OR REPLACE FUNCTION get_all_users_with_profiles()
    RETURNS TABLE (
        profile_id UUID,
        user_id UUID,
        points INT,
        email TEXT,
        created_at TIMESTAMPTZ
    ) AS $$
    BEGIN
        RETURN QUERY
        SELECT
            p.id as profile_id,
            u.id as user_id,
            p.points,
            u.email,
            u.created_at
        FROM
            auth.users AS u
        LEFT JOIN
            public.profiles AS p ON u.id = p.user_id;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;
  
  // Ensure the function exists before calling it.
  const { error: functionError } = await supabase.rpc('sql', { sql: functionQuery });
   if (functionError) {
    console.error("Error creating SQL function:", functionError.message);
    // Don't throw, as the function might already exist.
  }

  // Now, call the RPC function to get the joined data.
  const { data, error } = await supabase.rpc('get_all_users_with_profiles');

  if (error) {
    console.error("Error fetching users via RPC:", error.message || 'An unknown error occurred');
    return [];
  }

  return data as UserProfile[] || [];
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
                  <TableRow key={user.profile_id || user.user_id}>
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
