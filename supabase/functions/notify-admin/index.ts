// Deno Edge Function: notify-admin
// Sends an email to admin when a new booking is created
// Requires environment variables in Supabase: RESEND_API_KEY (and optional ADMIN_EMAIL)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

type RequestBody = {
  subject?: string;
  adminEmail?: string;
  booking?: Record<string, unknown>;
};

function renderEmailHtml(booking: Record<string, unknown> = {}) {
  const entries = Object.entries(booking || {});
  const rows = entries
    .map(([key, value]) => {
      const safeKey = String(key);
      const safeValue = typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
      return `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600">${safeKey}</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${safeValue}</td></tr>`;
    })
    .join("");
  return `
  <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
    <h2 style="margin-bottom:8px;">New Booking Submitted</h2>
    <p style="margin:0 0 16px;color:#374151">You have received a new booking. Details are below:</p>
    <table style="border-collapse:collapse;border:1px solid #e5e7eb;width:100%;max-width:640px;">${rows}</table>
    <p style="margin-top:16px;color:#6b7280;font-size:12px">This message was sent automatically by AdWhey.</p>
  </div>`;
}

async function sendWithResend(to: string, subject: string, html: string) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set');
  }

  // Use the default Resend domain
  const from = 'onboarding@resend.dev';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Resend error: ${res.status} ${res.statusText} - ${JSON.stringify(data)}`);
  }
  return data;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey, x-client-trace-id, x-client-session-id, x-client-user-agent, x-client-version, x-client-platform, x-client-request-id',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { 
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const { subject, adminEmail, booking }: RequestBody = await req.json().catch(() => ({} as RequestBody));
    const to = adminEmail || Deno.env.get('ADMIN_EMAIL') || 'adwheyofficial@gmail.com';
    const emailSubject = subject || 'New Booking Submitted';
    
    // Format the current date and time nicely
    const now = new Date();
    const formattedDateTime = now.toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    // Filter out created_at and id fields from booking data
    const { created_at, id, ...cleanBooking } = booking || {};
    
    const html = renderEmailHtml({ ...cleanBooking, submittedAt: formattedDateTime });

    const data = await sendWithResend(to, emailSubject, html);

    return new Response(JSON.stringify({ ok: true, id: data?.id }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 200,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Edge function error:', err);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 500,
    });
  }
});


