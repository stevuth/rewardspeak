
"use server";

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/utils/supabase/server';

type VpnCheckResult = {
    isVpn: boolean;
    countryCode: string | null;
}

async function checkVpn(ipAddress: string | null): Promise<VpnCheckResult> {
  // If no IP is provided from the client, we can't check. Block as a precaution.
  if (!ipAddress) {
    console.warn("VPN Check: No IP address provided from the client. Blocking request.");
    return { isVpn: true, countryCode: null };
  }
  
  const apiKey = process.env.IPHUB_API_KEY;

  // If the API key is not configured on the server, block the request as a security measure.
  if (!apiKey) {
    console.error("CRITICAL: IPHub API key is not configured in the environment. Blocking request.");
    return { isVpn: true, countryCode: null }; // Fail-closed: block if the key is missing.
  }

  try {
    const url = `https://v2.api.iphub.info/ip/${ipAddress}`;
    console.log(`VPN Check: Calling IPHub for IP ${ipAddress}`);
    
    const response = await fetch(url, {
      headers: { 'X-Key': apiKey }
    });

    console.log(`VPN Check: IPHub responded with status ${response.status}`);

    if (!response.ok) {
        // If the IPHub API itself fails, log the error but allow the request to avoid blocking legitimate users.
        console.error(`IPHub API call failed with status: ${response.status}. Allowing request as a precaution.`);
        return { isVpn: false, countryCode: null };
    }

    const data = await response.json();
    console.log(`VPN Check: IPHub data for ${ipAddress}:`, data);
    
    // IPHub returns { block: 1 } for VPN/proxy, and { block: 0 } for residential IPs.
    const isVpn = data.block === 1;
    if (isVpn) {
        console.log(`VPN/Proxy detected for IP: ${ipAddress}. Blocking access.`);
    } else {
        console.log(`VPN Check: IP ${ipAddress} is clean (block=${data.block})`);
    }
    
    return { isVpn, countryCode: data.countryCode || null };

  } catch (error) {
    console.error("VPN Check: Exception occurred:", error);
    return { isVpn: false, countryCode: null }; // Fail-open on any other exception to avoid blocking legitimate users.
  }
}


export async function login(prevState: { message: string, success?: boolean }, formData: FormData) {
  const ipAddress = formData.get('ip_address') as string | null;

  const { isVpn } = await checkVpn(ipAddress);
  if (isVpn) {
    return { message: 'Heads up! For fair rewards and security, VPNs and proxies aren’t allowed. Please reconnect without one.', success: false };
  }

  const supabase = createSupabaseServerClient(true);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { message: 'Email and password are required.', success: false };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes('User is banned')) {
        return { 
            message: "Account on Hold. We’ve paused your account because some activity didn’t match our fair use policy. Don’t worry — you can reach out to our support team to review and resolve this.", 
            success: false 
        };
    }
    return { message: error.message, success: false };
  }

  redirect('/dashboard?event=login');
}


export async function signup(prevState: { message: string, success?: boolean }, formData: FormData) {
  const ipAddress = formData.get('ip_address') as string | null;
  
  const { isVpn, countryCode } = await checkVpn(ipAddress);
  if (isVpn) {
    return { message: 'Heads up! For fair rewards and security, VPNs and proxies aren’t allowed. Please reconnect without one.', success: false };
  }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const referralCode = formData.get('referral_code') as string | null;

  if (!email || !password) {
    return { message: 'Email and password are required.', success: false };
  }

  const supabase = createSupabaseServerClient(true);

  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        referral_code: referralCode,
        country_code: countryCode
      },
    },
  });

  if (error) {
    const friendlyMessage = error.message.includes('unique constraint')
        ? 'A user with this email already exists.'
        : `Signup failed: ${error.message}`;
    return { message: friendlyMessage, success: false };
  }

  redirect('/auth/confirm');
}


export async function signOut() {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error.message);
    // Even if there's an error, we should still try to redirect.
    // The middleware will handle unauthenticated access.
  }
  
  // The redirect now includes query params to trigger the success modal on the homepage.
  return redirect('/?event=logout');
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

    
