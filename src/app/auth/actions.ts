
"use server";

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { createSupabaseAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

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

// Simple regex for basic email format validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


export async function login(prevState: { message: string, success?: boolean }, formData: FormData) {
  const ipAddress = formData.get('ip_address') as string | null;

  const { isVpn } = await checkVpn(ipAddress);
  if (isVpn) {
    return { message: "Heads up, climber! For a fair ascent, VPNs aren't allowed. Please reconnect without one to continue.", success: false };
  }

  const supabase = await createSupabaseServerClient(true);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { message: "You'll need both your email and password to enter the peak.", success: false };
  }

  if (!isValidEmail(email)) {
    return { message: "That email address doesn't look right. Please check it and try again.", success: false };
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
    if (error.message.includes('Invalid login credentials')) {
      return { message: "Lost your map? Your login details don't seem right. Please try that again.", success: false };
    }
    return { message: `A technical issue occurred: ${error.message}`, success: false };
  }

  redirect('/dashboard?event=login');
}


export async function signup(prevState: { message: string, success?: boolean }, formData: FormData) {
  const ipAddress = formData.get('ip_address') as string | null;

  const { isVpn, countryCode } = await checkVpn(ipAddress);
  if (isVpn) {
    return { message: "Heads up, climber! For a fair ascent, VPNs aren't allowed. Please reconnect without one to continue.", success: false };
  }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const referralCode = formData.get('referral_code') as string | null;
  const acceptedTerms = formData.get('accepted_terms') === 'on';

  if (!email || !password) {
    return { message: "You'll need both your email and password to start your climb.", success: false };
  }

  if (!isValidEmail(email)) {
    return { message: "That email address doesn't look quite right. Please double-check it.", success: false };
  }

  if (!acceptedTerms) {
    return { message: "Please agree to the Terms of Use and Privacy Policy to begin your journey.", success: false };
  }

  const supabase = await createSupabaseServerClient(true);

  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        referral_code: referralCode,
        country_code: countryCode,
        accepted_terms: true
      },
    },
  });

  if (error) {
    const friendlyMessage = error.message.includes('unique constraint')
      ? "It looks like another adventurer already has that email. Try logging in instead!"
      : `A technical issue occurred on the trail: ${error.message}`;
    return { message: friendlyMessage, success: false };
  }

  redirect('/auth/confirm');
}

export async function requestPasswordReset(prevState: { message: string, success?: boolean }, formData: FormData): Promise<{ message: string; success: boolean; }> {
  const email = formData.get('email') as string;

  if (!email) {
    return { message: 'Please enter your email to find your path again.', success: false };
  }

  if (!isValidEmail(email)) {
    return { message: 'That email address doesn\'t look quite right. Please double-check it.', success: false };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/auth/reset-password`,
  });

  if (error) {
    console.error("Password reset error:", error);
    return { message: `A technical issue occurred while sending the reset link. Please try again.`, success: false };
  }

  return { message: "If an account exists for this email, we've sent a recovery link to your inbox.", success: true };
}


export async function signOut() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error.message);
    // Even if there's an error, we should still try to redirect.
    // The middleware will handle unauthenticated access.
  }

  // The redirect now includes query params to trigger the success modal on the homepage.
  return redirect('/?event=logout');
}
