
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
    points: number;
    users: {
        email: string | null;
        created_at: string;
    } | null;
}

async function getAllUsers(): Promise<UserProfile[]> {
  const supabase = createSupabaseServerClient();
  
  // The correct way to join with auth.users is to treat the foreign key column
  // (user_id on the profiles table) as the relationship itself.
  const { data, error } = await supabase
    .from('profiles')
    .select(`
        id,
        points,
        users:user_id (
            email,
            created_at
        )
    `);

  if (error) {
    console.error("Error fetching users:", error.message || 'An unknown error occurred');
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
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.users?.email ?? 'N/A'}
                    </TableCell>
                    <TableCell>{user.points ?? 0}</TableCell>
                    <TableCell>
                      {user.users ? new Date(user.users.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.id ?? 'N/A'}</Badge>
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
