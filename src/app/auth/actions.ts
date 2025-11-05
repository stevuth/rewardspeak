
'use server'

import { createSupabaseAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/utils/supabase/server';

// This is the corrected function. It no longer uses the 'dotenv' package.
// It relies on the standard Next.js process for accessing environment variables.
async function checkVpn(ipAddress: string | null): Promise<boolean> {
  if (!ipAddress) {
    // Fail open: If we don't get an IP, we can't check it.
    // This could be changed to fail closed (return true) for higher security.
    console.warn("VPN Check: No IP address provided.");
    return false;
  }

  const apiKey = process.env.IPHUB_API_KEY;
  if (!apiKey) {
    console.error("CRITICAL: IPHub API key is not configured in .env. Skipping VPN check.");
    // Fail open if the API key is missing.
    return false;
  }

  try {
    const response = await fetch(`https://v2.iphub.info/ip/${ipAddress}`, {
      headers: { 'X-Key': apiKey }
    });

    if (!response.ok) {
        console.error(`IPHub API call failed with status: ${response.status}`);
        return false; // Fail open if API call fails
    }

    const data = await response.json();
    // block: 0 = residential, 1 = non-residential (VPN/proxy), 2 = both
    if (data.block === 1) {
        console.log(`VPN/Proxy detected for IP: ${ipAddress}. Blocking access.`);
        return true;
    }
    
    return false;

  } catch (error) {
    console.error("Error checking VPN with IPHub:", error);
    return false; // Fail open on any other error
  }
}


export async function login(prevState: { message: string, success?: boolean }, formData: FormData) {
  const ipAddress = formData.get('ip_address') as string | null;

  const isVpn = await checkVpn(ipAddress);
  if (isVpn) {
    return { message: 'Access denied. Please disable any VPN or proxy services to log in.', success: false };
  }

  const supabase = createSupabaseServerClient();
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
    return { message: error.message, success: false };
  }

  redirect('/dashboard?event=login');
}


export async function signup(prevState: { message: string, success?: boolean }, formData: FormData) {
  const ipAddress = formData.get('ip_address') as string | null;
  
  const isVpn = await checkVpn(ipAddress);
  if (isVpn) {
    return { message: 'Access denied. Please disable any VPN or proxy services to sign up.', success: false };
  }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const referralCode = formData.get('referral_code') as string | null;

  if (!email || !password) {
    return { message: 'Email and password are required.', success: false };
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        referral_code: referralCode,
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
