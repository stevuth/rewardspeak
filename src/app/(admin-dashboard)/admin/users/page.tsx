
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
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, X, Users } from "lucide-react";
import { WavingMascotLoader } from "@/components/waving-mascot-loader";
import { UserDetailsRow } from "./user-details-row";
import type { UserProfile } from "@/app/api/get-all-users/route";

export const runtime = 'edge';

export default function ManageUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [emailFilter, setEmailFilter] = useState('');
  const [idFilter, setIdFilter] = useState('');

  useEffect(() => {
    async function getAllUsers() {
      setIsLoading(true);
      try {
            const response = await fetch('/api/get-all-users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data.users);
        } catch (apiError) {
             console.error("Error fetching users from API:", apiError);
             setUsers([]);
        }

      setIsLoading(false);
    }
    getAllUsers();
  }, []);
  
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
        const emailMatch = emailFilter ? user.email?.toLowerCase().includes(emailFilter.toLowerCase()) : true;
        const idMatch = idFilter ? user.profile_id?.toLowerCase().includes(idFilter.toLowerCase()) : true;
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
                <Label htmlFor="id-filter">Filter by Referral Code</Label>
                 <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="id-filter"
                        placeholder="e.g. 84089"
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
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-64">
                    <WavingMascotLoader text="Loading users..." />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <UserDetailsRow key={user.user_id} user={user} />
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
