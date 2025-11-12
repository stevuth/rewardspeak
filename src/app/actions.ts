
"use server";

import { createSupabaseAdminClient } from "@/utils/supabase/admin";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { type NotikOffer } from "@/lib/notik-api";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';

// Helper to split an array into chunks
function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export async function adminLogin(prevState: { message: string, success?: boolean }, formData: FormData) {
    const supabase = createSupabaseServerClient(true);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { message: 'Email and password are required.', success: false };
    }
    
    if (!email.endsWith('@rewardspeak.com')) {
        return { message: 'Access denied. This portal is for administrators only.', success: false };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { message: `Authentication failed: ${error.message}`, success: false };
    }

    redirect('/admin/dashboard');
}


export async function supportLogin(prevState: { message: string, success?: boolean }, formData: FormData) {
    const supabase = createSupabaseServerClient(true);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { message: 'Email and password are required.', success: false };
    }
    
    if (!email.endsWith('@rewardspeak.com')) {
        return { message: 'Access denied. This portal is for support agents only.', success: false };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { message: `Authentication failed: ${error.message}`, success: false };
    }

    redirect('/support/dashboard');
}

export async function getFeaturedContent(contentType: 'featured_offers' | 'top_converting_offers'): Promise<{data: string[] | null, error: string | null}> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from('featured_content')
        .select('offer_ids')
        .eq('content_type', contentType)
        .single();
    
    if (error) {
        if (error.code === 'PGRST116') { // "Not a single row was found"
            return { data: [], error: null }; // Return empty array if no entry exists yet
        }
        console.error("Error fetching featured content:", error);
        return { data: null, error: error.message };
    }
    return { data: data.offer_ids, error: null };
}

export async function updateFeaturedContent(contentType: 'featured_offers' | 'top_converting_offers', offerIds: string[]): Promise<{success: boolean, error?: string}> {
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase
        .from('featured_content')
        .upsert({
            content_type: contentType,
            offer_ids: offerIds,
            updated_at: new Date().toISOString()
        }, { onConflict: 'content_type' });

    if (error) {
        console.error("Error updating featured content:", error);
        return { success: false, error: error.message };
    }
    
    // Revalidate paths where this content is displayed
    revalidatePath('/dashboard');
    revalidatePath('/admin/offer-preview');

    return { success: true };
}

export async function setOfferDisabledStatus(offerId: string, isDisabled: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from('all_offers')
    .update({ is_disabled: isDisabled })
    .eq('offer_id', offerId);

  if (error) {
    console.error("Error updating offer status:", error);
    return { success: false, error: error.message };
  }

  // Revalidate all paths where offers might be displayed
  revalidatePath('/admin/offers', 'page');
  revalidatePath('/admin/offer-preview');
  revalidatePath('/dashboard');
  revalidatePath('/earn');

  return { success: true };
}

export async function getOfferPayoutPercentage(): Promise<{ data: number; error: string | null; }> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'offer_payout_percentage')
        .single();
    
    if (error) {
        // If the key doesn't exist, return a default of 100%
        if (error.code === 'PGRST116') { 
            return { data: 100, error: null };
        }
        console.error("Error fetching payout percentage:", error);
        return { data: 100, error: error.message };
    }
    
    return { data: Number(data.value), error: null };
}

export async function updateOfferPayoutPercentage(percentage: number): Promise<{ success: boolean; error?: string; }> {
    const supabase = createSupabaseAdminClient();
    if (percentage < 0 || percentage > 100) {
        return { success: false, error: "Percentage must be between 0 and 100." };
    }

    const { error } = await supabase
        .from('site_config')
        .upsert({
            key: 'offer_payout_percentage',
            value: String(percentage),
        }, { onConflict: 'key' });
    
    if (error) {
        console.error("Error updating payout percentage:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/offers', 'page');
    revalidatePath('/admin/offer-preview', 'page');
    revalidatePath('/dashboard', 'page');
    revalidatePath('/earn', 'page');

    return { success: true };
}

export async function getOfferDisplayLimit(): Promise<{ data: number; error: string | null; }> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'offer_display_limit')
        .single();
    
    if (error) {
        // If the key doesn't exist, return a default
        if (error.code === 'PGRST116') { 
            return { data: 1000, error: null };
        }
        console.error("Error fetching offer display limit:", error);
        return { data: 1000, error: error.message };
    }
    
    return { data: Number(data.value), error: null };
}

export async function updateOfferDisplayLimit(limit: number): Promise<{ success: boolean; error?: string; }> {
    const supabase = createSupabaseAdminClient();
    if (limit <= 0) {
        return { success: false, error: "Limit must be a positive number." };
    }

    const { error } = await supabase
        .from('site_config')
        .upsert({
            key: 'offer_display_limit',
            value: String(limit),
        }, { onConflict: 'key' });
    
    if (error) {
        console.error("Error updating offer display limit:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/offers', 'page');
    revalidatePath('/earn', 'page');

    return { success: true };
}

type WithdrawalPayload = {
    amount: number;
    method: 'paypal' | 'usdt';
    walletAddress: string;
};

export async function processWithdrawalRequest(payload: WithdrawalPayload): Promise<{ success: boolean, error?: string }> {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "You must be logged in to make a withdrawal." };
    }

    const adminSupabase = createSupabaseAdminClient();

    const { error: rpcError } = await adminSupabase.rpc('process_withdrawal', {
        p_user_id: user.id,
        p_email: user.email!,
        p_amount_usd: payload.amount,
        p_method: payload.method,
        p_wallet_address: payload.walletAddress,
    });
    
    if (rpcError) {
        console.error("Error in process_withdrawal RPC:", rpcError);
        const errorMessage = rpcError.message.includes("Not enough points") 
            ? "Insufficient balance for this withdrawal." 
            : "An unexpected error occurred. Please try again later.";
        return { success: false, error: errorMessage };
    }

    revalidatePath('/withdraw'); // Revalidate the withdrawal page to update history
    revalidatePath('/dashboard', 'layout'); // Revalidate layout to update user points

    return { success: true };
}

type GetWithdrawalRequestsParams = {
    page: number;
    limit: number;
    email?: string;
    method?: string;
    status?: string;
}

export async function getWithdrawalRequests({ page, limit, email, method, status }: GetWithdrawalRequestsParams): Promise<{requests: any[] | null, count: number | null}> {
    const supabase = createSupabaseAdminClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('withdrawal_requests')
        .select('*', { count: 'exact' });

    if (email) {
        query = query.ilike('email', `%${email}%`);
    }
    if (method && method !== 'all') {
        query = query.eq('method', method);
    }
    if (status && status !== 'all') {
        query = query.eq('status', status);
    }

    const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error("Error fetching withdrawal requests:", error);
        return { requests: null, count: 0 };
    }

    return { requests: data, count };
}

export async function getAllWithdrawalRequestsForCSV({ email, method, status }: Omit<GetWithdrawalRequestsParams, 'page' | 'limit'>): Promise<{requests: any[] | null, error?: string}> {
    const supabase = createSupabaseAdminClient();

    let query = supabase
        .from('withdrawal_requests')
        .select('*');

    if (email) {
        query = query.ilike('email', `%${email}%`);
    }
    if (method && method !== 'all') {
        query = query.eq('method', method);
    }
    if (status && status !== 'all') {
        query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
        console.error("Error fetching all withdrawal requests for CSV:", error);
        return { requests: null, error: error.message };
    }
    
    return { requests: data };
}


export async function updateWithdrawalRequestStatus(id: string, status: 'completed' | 'rejected'): Promise<{success: boolean, error?: string}> {
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase.rpc('update_withdrawal_status', {
        request_id: id,
        new_status: status
    });

    if (error) {
        console.error("Error calling update_withdrawal_status RPC:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/withdrawals');
    revalidatePath('/withdraw');
    revalidatePath('/dashboard', 'layout');

    return { success: true };
}


export async function updateBulkWithdrawalRequestStatus(ids: string[], status: 'completed' | 'rejected'): Promise<{ success: boolean; processed: number; failed: number; error?: string }> {
    const supabase = createSupabaseAdminClient();
    let processed = 0;
    let failed = 0;

    for (const id of ids) {
        const { error } = await supabase.rpc('update_withdrawal_status', {
            request_id: id,
            new_status: status
        });

        if (error) {
            failed++;
            console.error(`Error in bulk update for request ID ${id}:`, error);
        } else {
            processed++;
        }
    }

    if (processed > 0) {
        revalidatePath('/admin/withdrawals');
        revalidatePath('/withdraw');
        revalidatePath('/dashboard', 'layout');
    }

    if (failed > 0) {
        return {
            success: false,
            processed,
            failed,
            error: `Failed to update ${failed} out of ${ids.length} requests.`
        };
    }

    return { success: true, processed, failed };
}

export async function updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
        console.error("Error updating password:", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function banUser(userId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: '876000h' // 100 years
    });

    if (error) {
        console.error(`Failed to ban user ${userId}:`, error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/users');
    return { success: true };
}

export async function unbanUser(userId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: 'none'
    });

    if (error) {
        console.error(`Failed to unban user ${userId}:`, error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/users');
    return { success: true };
}


// New Server Actions for Support Tickets

export async function createSupportTicket(formData: FormData): Promise<{ success: boolean; error?: string, ticketId?: string }> {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "You must be logged in to submit a ticket." };
    }
    
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const attachment = formData.get('attachment') as File | null;

    if (!subject || !message) {
        return { success: false, error: "Subject and message are required." };
    }

    let attachmentUrl: string | null = null;
    
    // 1. Handle file upload if an attachment exists
    if (attachment && attachment.size > 0) {
        const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('support_attachments');

        if (bucketError || !bucketData) {
            console.error("Storage bucket 'support_attachments' not found.", bucketError);
            return { success: false, error: "Configuration error: Support attachment storage is not available. Please contact support directly." };
        }
        
        const fileExt = attachment.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
            .from('support_attachments')
            .upload(fileName, attachment);

        if (uploadError) {
            console.error("Error uploading support attachment:", uploadError);
            return { success: false, error: `Failed to upload attachment: ${uploadError.message}` };
        }
        
        const { data: urlData } = supabase.storage
            .from('support_attachments')
            .getPublicUrl(fileName);
            
        attachmentUrl = urlData.publicUrl;
    }

    const adminSupabase = createSupabaseAdminClient();

    // 2. Create the ticket
    const { data: ticket, error: ticketError } = await adminSupabase
        .from('support_tickets')
        .insert({
            user_id: user.id,
            user_email: user.email,
            subject: subject,
        })
        .select()
        .single();
    
    if (ticketError) {
        console.error("Error creating support ticket:", ticketError);
        return { success: false, error: "Could not create the ticket." };
    }
  
    // 3. Create the initial message
    const { error: messageError } = await adminSupabase
        .from('ticket_messages')
        .insert({
            ticket_id: ticket.id,
            user_id: user.id,
            message: message,
            is_from_support: false,
            attachment_url: attachmentUrl,
        });
        
    if (messageError) {
        console.error("Error creating initial ticket message:", messageError);
        await adminSupabase.from('support_tickets').delete().eq('id', ticket.id);
        return { success: false, error: "Could not save the ticket message." };
    }

    revalidatePath('/support/dashboard');
    revalidatePath('/help');

    return { success: true, ticketId: ticket.id };
}


export async function getSupportTickets(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    const supabase = createSupabaseAdminClient();

    // 1. Fetch all tickets
    const { data: tickets, error: ticketsError } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

    if (ticketsError) {
        console.error("Error fetching support tickets:", ticketsError);
        return { success: false, error: "Failed to fetch tickets." };
    }
    if (!tickets || tickets.length === 0) {
        return { success: true, data: [] };
    }
    
    const ticketIds = tickets.map(t => t.id);
    const { data: messages, error: messagesError } = await supabase
        .from('ticket_messages')
        .select('*')
        .in('ticket_id', ticketIds)
        .order('created_at', { ascending: true });

    if (messagesError) {
        console.error("Error fetching ticket messages:", messagesError);
        return { success: false, error: "Failed to fetch ticket messages." };
    }

    const ticketsWithMessages = tickets.map(ticket => ({
        ...ticket,
        messages: messages.filter(m => m.ticket_id === ticket.id)
    }));

    return { success: true, data: ticketsWithMessages };
}

export async function addSupportReply(payload: { ticket_id: string, message: string, isFromSupport: boolean }): Promise<{ success: boolean; data?: any, error?: string }> {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Authentication required." };
    }
    
    // Server-side validation
    const isAdmin = user.email?.endsWith('@rewardspeak.com');
    if (payload.isFromSupport && !isAdmin) {
        return { success: false, error: "You are not authorized to send messages as support." };
    }
     if (!payload.isFromSupport && isAdmin) {
        return { success: false, error: "Admins cannot send messages as users." };
    }

    const adminSupabase = createSupabaseAdminClient();
    const { data: newMessage, error } = await adminSupabase
        .from('ticket_messages')
        .insert({
            ticket_id: payload.ticket_id,
            user_id: user.id, // The ID of the sender
            message: payload.message,
            is_from_support: payload.isFromSupport,
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding support reply:", error);
        return { success: false, error: `Database error: ${error.message}` };
    }

    revalidatePath('/support/dashboard');
    revalidatePath('/help');

    return { success: true, data: newMessage };
}

export async function getTicketTemplates(): Promise<{ title: string; content: string }[]> {
    // In a real app, this would come from a database. For now, it's a static list.
    return [
        {
            title: "Request More Info",
            content: "Hello,\n\nThank you for reaching out. To help us investigate this further, could you please provide some more details? Specifically, we need:\n\n1. The name of the offer.\n2. The date you completed it.\n3. A screenshot of the completion if possible.\n\nThank you for your cooperation."
        },
        {
            title: "Offer Credited Manually",
            content: "Hello,\n\nWe've reviewed your case and have manually credited the points for the offer to your account. You should see the updated balance now.\n\nThank you for your patience."
        },
        {
            title: "VPN/Proxy Warning",
            content: "Hello,\n\nWe noticed that your account activity may be associated with a VPN or proxy service. As per our Terms of Service, the use of such services is not permitted.\n\nPlease disable any VPN or proxy and try again. Continued use may result in account suspension."
        }
    ];
}

export async function updateTicketStatus(ticketId: string, status: 'open' | 'closed'): Promise<{ success: boolean; error?: string }> {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
        .from('support_tickets')
        .update({ status: status, updated_at: new Date().toISOString() })
        .eq('id', ticketId);

    if (error) {
        console.error(`Failed to update ticket ${ticketId} to ${status}:`, error);
        return { success: false, error: error.message };
    }

    revalidatePath('/support/dashboard');
    revalidatePath('/help');
    
    return { success: true };
}
