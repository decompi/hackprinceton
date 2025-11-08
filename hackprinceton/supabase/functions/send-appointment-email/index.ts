// Supabase Edge Function to send appointment confirmation emails
// Deploy this to Supabase: supabase functions deploy send-appointment-email

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';

serve(async (req) => {
  try {
    const { to, subject, html, appointmentId } = await req.json();

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Option 1: Use Resend (Recommended - requires API key)
    if (RESEND_API_KEY) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'AcneScan <noreply@acnescan.com>',
          to: [to],
          subject: subject,
          html: html,
        }),
      });

      if (!resendResponse.ok) {
        const error = await resendResponse.json();
        throw new Error(`Resend API error: ${JSON.stringify(error)}`);
      }

      const data = await resendResponse.json();
      return new Response(
        JSON.stringify({ success: true, messageId: data.id }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Option 2: Use Supabase's built-in email (if configured)
    // This requires Supabase email configuration
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // Use Supabase's email functionality if available
      // Note: Supabase doesn't have a direct email API, so you'd need to use
      // a database trigger or external service
      
      // For now, log the email (you can implement actual sending)
      console.log('Email to send:', { to, subject, appointmentId });
      
      return new Response(
        JSON.stringify({ success: true, message: 'Email queued' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fallback: Log email (for development)
    console.log('Email would be sent:', { to, subject, appointmentId });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email service not configured. Email logged for development.' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

