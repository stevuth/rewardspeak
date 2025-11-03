
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
type UserProfile = {
    id: string;
    user_id: string;
    points: number;
    users: {
        email: string | null;
        created_at: string;
    } | null;
}

async function getAllUsers(): Promise<UserProfile[]> {
  const supabase = createSupabaseServerClient();
  // Corrected query: Select from 'profiles' and explicitly join with 'users' from the auth schema.
  const { data, error } = await supabase
    .from('profiles')
    .select(`
        id,
        user_id,
        points,
        users:user_id (
            email,
            created_at
        )
    `);

  if (error) {
    // The error object might be empty, so we log a more descriptive message.
    console.error("Error fetching users:", error.message || 'An unknown error occurred');
    return [];
  }

  // Ensure data is not null and fits the UserProfile type
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
                users.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      {profile.users?.email ?? 'N/A'}
                    </TableCell>
                    <TableCell>{profile.points}</TableCell>
                    <TableCell>
                      {profile.users ? new Date(profile.users.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{profile.id}</Badge>
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
