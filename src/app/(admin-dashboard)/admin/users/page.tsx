
'use client';

import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { WavingMascotLoader } from "@/components/waving-mascot-loader";

type UserProfile = {
  user_id: string;
  email: string | null;
  created_at: string;
  profile_id: string | null;
  points: number | null;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [emailFilter, setEmailFilter] = useState('');
  const [idFilter, setIdFilter] = useState('');

  useEffect(() => {
    async function getAllUsers() {
      setIsLoading(true);
      // NOTE: This uses a browser client, but fetches from a route that uses the admin client.
      // For a real-world app, you'd create a dedicated API route that uses the Supabase Admin client
      // to fetch all users, as listing users is a privileged operation.
      // For this implementation, we will simulate this by fetching profiles and matching them.
      const supabase = createSupabaseBrowserClient();
      
      // This is not a secure or scalable way to get all users on the client.
      // This should be an API route with admin privileges.
      // We will create a simplified version here for demonstration.
      // A full implementation would require an API route.
      // To simulate, we'll fetch all profiles, which is not ideal but works for this context.
      const { data: profiles, error } = await supabase.from('profiles').select('*');
      
      if (error) {
        console.error("Error fetching profiles:", error.message);
        setUsers([]);
      } else {
        const userProfiles: UserProfile[] = (profiles || []).map(p => ({
          user_id: p.user_id,
          email: 'user@example.com', // Placeholder as we can't get email from profiles table easily
          created_at: p.created_at,
          profile_id: p.id,
          points: p.points
        }));
        // Since we can't get auth users easily on client, we'll just use profile data.
        // A proper implementation would need a dedicated API route.
        // Let's create a temporary API route to do this correctly.
        try {
            const response = await fetch('/api/get-all-users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data.users);
        } catch (apiError) {
             console.error("Error fetching users from API:", apiError);
             setUsers([]);
        }

      }
      setIsLoading(false);
    }
    getAllUsers();
  }, []);
  
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
        const emailMatch = emailFilter ? user.email?.toLowerCase().includes(emailFilter.toLowerCase()) : true;
        const idMatch = idFilter ? user.user_id?.toLowerCase().includes(idFilter.toLowerCase()) : true;
        return emailMatch && idMatch;
    });
  }, [users, emailFilter, idFilter]);
  
  const handleClear = () => {
    setEmailFilter('');
    setIdFilter('');
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage Users"
        description={`A total of ${filteredUsers.length} users match the current filters.`}
      />
      <Card>
        <CardHeader>
            <CardTitle>Filter Users</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="email-filter">Filter by Email</Label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="email-filter"
                        placeholder="user@example.com"
                        value={emailFilter}
                        onChange={(e) => setEmailFilter(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="id-filter">Filter by User ID</Label>
                 <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="id-filter"
                        placeholder="UUID..."
                        value={idFilter}
                        onChange={(e) => setIdFilter(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>
            {(emailFilter || idFilter) && (
                 <Button onClick={handleClear} variant="outline" className="w-fit">
                    <X className="mr-2 h-4 w-4"/>
                    Clear Filters
                </Button>
            )}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Points</TableHead>
                <TableHead className="font-semibold">Joined</TableHead>
                <TableHead className="font-semibold">User ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-64">
                    <WavingMascotLoader text="Loading users..." />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {user.email ?? 'N/A'}
                    </TableCell>
                    <TableCell>{user.points ?? 0}</TableCell>
                    <TableCell>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">{user.user_id}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No users found for the current filters.
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
