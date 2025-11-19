
'use client';

import { useState, useEffect, useMemo, Suspense } from "react";
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
import { useSearchParams, useRouter } from "next/navigation";

function ManageUsersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const emailFilterParam = searchParams.get('email') || '';
  const idFilterParam = searchParams.get('id') || '';

  const [emailFilter, setEmailFilter] = useState(emailFilterParam);
  const [idFilter, setIdFilter] = useState(idFilterParam);


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
        const emailMatch = emailFilterParam ? user.email?.toLowerCase().includes(emailFilterParam.toLowerCase()) : true;
        const idMatch = idFilterParam ? user.profile_id?.toLowerCase().includes(idFilterParam.toLowerCase()) : true;
        return emailMatch && idMatch;
    });
  }, [users, emailFilterParam, idFilterParam]);
  
  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (emailFilter) {
      params.set('email', emailFilter);
    } else {
      params.delete('email');
    }
    if (idFilter) {
      params.set('id', idFilter);
    } else {
      params.delete('id');
    }
    router.push(`/admin/users?${params.toString()}`);
  };

  const handleClear = () => {
    setEmailFilter('');
    setIdFilter('');
    router.push('/admin/users');
  };

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
            <div className="flex gap-2">
                 <Button onClick={handleFilter}>
                    <Search className="mr-2 h-4 w-4"/>
                    Filter
                </Button>
                <Button onClick={handleClear} variant="outline">
                    <X className="mr-2 h-4 w-4"/>
                    Clear Filters
                </Button>
            </div>
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


export default function ManageUsersPage() {
    return (
        <Suspense fallback={<div className="flex h-96 w-full items-center justify-center"><WavingMascotLoader text="Loading user filters..." /></div>}>
            <ManageUsersPageContent />
        </Suspense>
    )
}
