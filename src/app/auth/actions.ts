
'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

async function checkVpn(ipAddress: string | null): Promise<boolean> {
  if (!ipAddress) {
    // Fail open: If we don't get an IP, we can't check it.
    // You might want to change this to fail closed (return true) for higher security.
    return false;
  }

  const apiKey = process.env.IPHUB_API_KEY;
  if (!apiKey) {
    console.warn("IPHub API key is not configured. Skipping VPN check.");
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
    return data.block === 1;
  } catch (error) {
    console.error("Error checking VPN with IPHub:", error);
    return false; // Fail open on error
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
