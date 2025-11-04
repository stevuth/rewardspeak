
import { NextResponse, type NextRequest } from 'next/server'

interface HubResponse {
    countryName: string;
    countryCode: string;
    block: 0 | 1;
    asn: number;
    ip: string;
    method: 'B' | 'C' | 'D';
}

export async function getClientIp(request: NextRequest): Promise<string> {
    let ip = request.ip ?? request.headers.get('x-real-ip');
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (!ip && forwardedFor) {
        ip = forwardedFor.split(',').at(0) ?? null;
    }
    return ip || '127.0.0.1';
}


export async function checkIpWithHub(clientIp: string | null): Promise<{ block: boolean; message: string; }> {
    const hubApiKey = process.env.IP_HUB_API_KEY;
    if (!hubApiKey) {
        console.warn("IP_HUB_API_KEY is not set. Skipping IP check.");
        return { block: false, message: "IP check skipped." };
    }
    
    if (!clientIp) {
        return { block: true, message: "Could not determine IP address." };
    }
    
    try {
        const response = await fetch(`https://v2.api.iphub.info/ip/${clientIp}`, {
            headers: { 'X-Key': hubApiKey }
        });

        if (!response.ok) {
            console.error(`IP Hub API error: ${response.statusText}`);
            return { block: false, message: "IP verification service unavailable." };
        }

        const data: HubResponse = await response.json();

        if (data.block === 1) {
            return { block: true, message: "VPN/Proxy detected." };
        }
        return { block: false, message: "IP is clean.", };

    } catch (error) {
        console.error("Error checking IP with Hub:", error);
        return { block: false, message: "Error during IP verification." };
    }
}
