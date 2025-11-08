# Simple Email Setup (No Edge Functions Required)

## Quick Setup - 2 Steps!

### Step 1: Add Resend API Key to Environment Variables

Add this to your `.env.local` file (create it if it doesn't exist):

```env
NEXT_PUBLIC_RESEND_API_KEY=re_Chc9nHKJ_Xsbtc2NJhzKnCoPDvjJvYz7b
```

**Location:** `/Users/zach/Desktop/hackprinceton/hackprinceton/.env.local`

### Step 2: Restart Your Development Server

```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
```

That's it! The email will now be sent directly from your frontend using Resend API.

## How It Works

- When an appointment is booked, the app calls Resend API directly
- No Supabase Edge Functions needed
- No deployment required
- Works immediately after adding the API key

## Verify Domain (Optional but Recommended)

1. Go to https://resend.com/domains
2. Add your domain (e.g., `acnescan.com`)
3. Verify it with DNS records
4. Update the `from` field in `lib/email.ts`:
   ```typescript
   from: 'AcneScan <noreply@yourdomain.com>',
   ```

For now, it uses `onboarding@resend.dev` which works for testing.

## Testing

1. Book an appointment in your app
2. Check the user's email inbox
3. You should receive a confirmation email

## Troubleshooting

### "Email not sending"
- Check that `.env.local` has `NEXT_PUBLIC_RESEND_API_KEY`
- Restart your dev server after adding the key
- Check browser console for errors

### "Unauthorized" error
- Verify your Resend API key is correct
- Make sure it starts with `re_`

### "Domain not verified"
- For testing, `onboarding@resend.dev` works
- For production, verify your domain in Resend dashboard

