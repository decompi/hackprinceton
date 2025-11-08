# Step-by-Step: Deploy Email Function

## Prerequisites

1. ✅ You have a Resend API key: `re_Chc9nHKJ_Xsbtc2NJhzKnCoPDvjJvYz7b`
2. You need Supabase CLI installed
3. You need to be logged into Supabase

## Step 1: Install Supabase CLI (if not installed)

```bash
npm install -g supabase
```

Or with Homebrew (Mac):
```bash
brew install supabase/tap/supabase
```

## Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate.

## Step 3: Link Your Project

You need your Supabase project reference ID. Find it in your Supabase dashboard URL:
- Dashboard URL: `https://supabase.com/dashboard/project/xxxxx`
- The `xxxxx` part is your project ref

Then run:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Or if you're already in the project directory:
```bash
cd /Users/zach/Desktop/hackprinceton/hackprinceton
supabase link --project-ref YOUR_PROJECT_REF
```

## Step 4: Set the Resend API Key Secret

```bash
supabase secrets set RESEND_API_KEY=re_Chc9nHKJ_Xsbtc2NJhzKnCoPDvjJvYz7b
```

## Step 5: Deploy the Edge Function

Make sure you're in the project directory:
```bash
cd /Users/zach/Desktop/hackprinceton/hackprinceton
supabase functions deploy send-appointment-email
```

## Step 6: Verify Deployment

Check that the function is deployed:
```bash
supabase functions list
```

You should see `send-appointment-email` in the list.

## Step 7: Test the Email Function

1. Go to your app
2. Book an appointment
3. Check the user's email inbox
4. You should receive a confirmation email

## Troubleshooting

### "Command not found: supabase"
- Install Supabase CLI: `npm install -g supabase`

### "Not logged in"
- Run: `supabase login`

### "Project not linked"
- Run: `supabase link --project-ref YOUR_PROJECT_REF`
- Find your project ref in the Supabase dashboard URL

### "Function not found"
- Make sure the file exists at: `supabase/functions/send-appointment-email/index.ts`
- Check you're in the correct directory

### "Secret not set"
- Run: `supabase secrets set RESEND_API_KEY=re_Chc9nHKJ_Xsbtc2NJhzKnCoPDvjJvYz7b`
- Verify: `supabase secrets list`

### Check Function Logs
```bash
supabase functions logs send-appointment-email
```

## Alternative: Quick Setup Script

Create a file `deploy-email.sh`:

```bash
#!/bin/bash
echo "Setting Resend API key..."
supabase secrets set RESEND_API_KEY=re_Chc9nHKJ_Xsbtc2NJhzKnCoPDvjJvYz7b

echo "Deploying email function..."
supabase functions deploy send-appointment-email

echo "Done! Check logs with: supabase functions logs send-appointment-email"
```

Make it executable and run:
```bash
chmod +x deploy-email.sh
./deploy-email.sh
```

