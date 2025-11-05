
'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { env } from 'process';

async function checkVpn(ipAddress: string | null): Promise<boolean> {
  // If no IP is provided from the client, we can't check.
  if (!ipAddress) {
    console.warn("VPN Check: No IP address provided from the client. Allowing request.");
    return false;
  }
  
  const apiKey = env.IPHUB_API_KEY;

  if (!apiKey) {
    console.error("CRITICAL: IPHub API key is not configured in the environment. Blocking request as a security measure.");
    return true; // Fail-closed: block if the key is missing.
  }

  try {
    const response = await fetch(`https://v2.iphub.info/ip/${ipAddress}`, {
      headers: { 'X-Key': apiKey }
    });

    if (!response.ok) {
        console.error(`IPHub API call failed with status: ${response.status}. Allowing request as a precaution.`);
        return false; // Fail-open on API error to avoid blocking legitimate users.
    }

    const data = await response.json();
    
    // IPHub returns { block: 1 } for VPN/proxy, and { block: 0 } for residential IPs.
    if (data.block === 1) {
        console.log(`VPN/Proxy detected for IP: ${ipAddress}. Blocking access.`);
        return true; // Is a VPN
    }
    
    return false; // Is not a VPN

  } catch (error) {
    console.error("Error checking VPN with IPHub:", error);
    return false; // Fail-open on any exception.
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
