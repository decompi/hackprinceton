# Email Confirmation Setup Guide

This guide explains how to set up email confirmations for appointment bookings.

## Current Implementation

The app is configured to send confirmation emails when appointments are booked. The email includes:
- Appointment date and time
- Dermatologist name and specialty
- Location/telehealth information
- Appointment ID
- Reason for visit (if provided)

## Setup Options

### Option 1: Resend (Recommended - Easiest)

1. **Sign up for Resend** at https://resend.com
2. **Get your API key** from the dashboard
3. **Add to Supabase Edge Function secrets**:
   ```bash
   supabase secrets set RESEND_API_KEY=re_Chc9nHKJ_Xsbtc2NJhzKnCoPDvjJvYz7b
   ```
4. **Deploy the Edge Function**:
   ```bash
   supabase functions deploy send-appointment-email
   ```

### Option 2: SendGrid

1. **Sign up for SendGrid** at https://sendgrid.com
2. **Get your API key**
3. **Update the Edge Function** to use SendGrid API
4. **Add secret**:
   ```bash
   supabase secrets set SENDGRID_API_KEY=your_api_key_here
   ```

### Option 3: Nodemailer with SMTP

1. **Get SMTP credentials** from your email provider (Gmail, Outlook, etc.)
2. **Update the Edge Function** to use Nodemailer
3. **Add secrets**:
   ```bash
   supabase secrets set SMTP_HOST=smtp.gmail.com
   supabase secrets set SMTP_PORT=587
   supabase secrets set SMTP_USER=your_email@gmail.com
   supabase secrets set SMTP_PASS=your_app_password
   ```

### Option 4: Supabase Database Triggers (Advanced)

You can set up a database trigger that sends emails when appointments are created:

```sql
-- Create a function that sends email via webhook
CREATE OR REPLACE FUNCTION send_appointment_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Call your email service webhook
  PERFORM net.http_post(
    url := 'https://your-email-service.com/webhook',
    body := jsonb_build_object(
      'to', (SELECT email FROM users WHERE id = NEW.user_id),
      'subject', 'Appointment Confirmation',
      'appointment_id', NEW.id
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER appointment_email_trigger
  AFTER INSERT ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION send_appointment_email();
```

## Quick Setup with Resend

### Step 1: Install Supabase CLI (if not already installed)
```bash
npm install -g supabase
```

### Step 2: Login to Supabase
```bash
supabase login
```

### Step 3: Link your project
```bash
supabase link --project-ref your-project-ref
```

### Step 4: Set Resend API key
```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Step 5: Deploy the function
```bash
supabase functions deploy send-appointment-email
```

## Testing

After setup, test the email functionality:

1. Book an appointment through the app
2. Check the user's email inbox
3. Verify the email contains all appointment details

## Email Template Customization

The email template is in `lib/email.ts` in the `createEmailTemplate` function. You can customize:
- Colors and styling
- Content and messaging
- Additional information
- Branding

## Troubleshooting

### Emails not sending
1. Check Edge Function logs: `supabase functions logs send-appointment-email`
2. Verify API keys are set correctly
3. Check email service dashboard for delivery status
4. Ensure the user's email address is valid

### Edge Function not found
- Make sure you've deployed the function
- Check function name matches exactly
- Verify Supabase project is linked correctly

### Development Mode
In development, emails are logged to the console. To test actual sending, you need to:
1. Deploy the Edge Function
2. Set up your email service API key
3. Use the deployed function URL

## Environment Variables

For local development, create `.env.local`:
```env
RESEND_API_KEY=your_key_here
```

Note: Edge Functions use Supabase secrets, not `.env.local` files.

