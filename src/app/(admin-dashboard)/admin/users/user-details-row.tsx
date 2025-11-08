
"use client";

import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, User, Globe, Calendar, Clock, Fingerprint, Coins, Gift, Percent, Link as LinkIcon, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/app/api/get-all-users/route";
import { SafeImage } from "@/components/safe-image";

function getFlagEmoji(countryCode: string | null): string {
    if (!countryCode || countryCode.length !== 2) return '🏳️';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

const DetailItem = ({ icon: Icon, label, children }: { icon: React.ElementType, label: string, children: React.ReactNode }) => (
    <div>
        <h4 className="font-semibold text-sm flex items-center gap-2 mb-1">
            <Icon className="h-4 w-4 text-muted-foreground" />
            {label}
        </h4>
        <div className="text-sm text-foreground ml-6">
            {children}
        </div>
    </div>
);

export function UserDetailsRow({ user }: { user: UserProfile }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell className="w-16">
            <SafeImage 
                src={user.avatar_url || ''}
                alt={user.email || 'user avatar'}
                width={40}
                height={40}
                className="rounded-full object-cover"
            />
        </TableCell>
        <TableCell className="font-medium max-w-[250px] truncate">{user.email ?? 'N/A'}</TableCell>
        <TableCell>
            <Badge variant="secondary">{user.points?.toLocaleString() ?? 0} Pts</Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</TableCell>
        <TableCell className="hidden lg:table-cell">
            <Badge variant="outline" className="font-mono">{user.profile_id}</Badge>
        </TableCell>
        <TableCell>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? "Hide" : "Show"} Details
              {isOpen ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow>
          <TableCell colSpan={6}>
            <div className="p-4 bg-muted/30 rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                <DetailItem icon={User} label="User Email">
                    {user.email || 'N/A'}
                </DetailItem>
                <DetailItem icon={Fingerprint} label="Supabase User ID">
                    <Badge variant="outline" className="font-mono text-xs">{user.user_id}</Badge>
                </DetailItem>
                <DetailItem icon={Hash} label="Referral Code">
                    <Badge variant="outline" className="font-mono text-xs">{user.profile_id}</Badge>
                </DetailItem>
                 <DetailItem icon={Calendar} label="Date Joined">
                    {user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}
                </DetailItem>
                <DetailItem icon={Clock} label="Last Sign In">
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}
                </DetailItem>
                 <DetailItem icon={Globe} label="Country">
                    {user.country_code ? `${getFlagEmoji(user.country_code)} ${user.country_code}` : 'N/A'}
                </DetailItem>
                <DetailItem icon={Coins} label="Current Points Balance">
                    <span className="font-bold text-secondary">{user.points?.toLocaleString() ?? 0}</span>
                </DetailItem>
                 <DetailItem icon={Gift} label="Lifetime Withdrawn">
                    {user.withdrawn?.toLocaleString() ?? 0} Pts
                </DetailItem>
                 <DetailItem icon={Percent} label="Lifetime Referral Earnings">
                    {user.referral_earnings?.toLocaleString() ?? 0} Pts
                </DetailItem>
                 <DetailItem icon={LinkIcon} label="Avatar URL">
                    <a href={user.avatar_url || ''} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs break-all">
                        {user.avatar_url || 'No avatar'}
                    </a>
                </DetailItem>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
