-- Supabase Database Schema for AcneScan App
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  profile_pic TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scans table
CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT,
  acne_type TEXT,
  causes TEXT[],
  confidence FLOAT,
  analysis_date TIMESTAMPTZ DEFAULT NOW()
);

-- Dermatologists table
CREATE TABLE IF NOT EXISTS dermatologists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialty TEXT,
  email TEXT,
  phone TEXT,
  bio TEXT,
  location TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  dermatologist_id UUID REFERENCES dermatologists(id) ON DELETE CASCADE,
  scan_id UUID REFERENCES scans(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_analysis_date ON scans(analysis_date);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_dermatologist_id ON appointments(dermatologist_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_dermatologists_available ON dermatologists(available);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for scans
DROP POLICY IF EXISTS "Users can view own scans" ON scans;
CREATE POLICY "Users can view own scans" ON scans
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own scans" ON scans;
CREATE POLICY "Users can insert own scans" ON scans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for appointments
DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;
CREATE POLICY "Users can view own appointments" ON appointments
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own appointments" ON appointments;
CREATE POLICY "Users can create own appointments" ON appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for dermatologists (public read)
DROP POLICY IF EXISTS "Anyone can view available dermatologists" ON dermatologists;
CREATE POLICY "Anyone can view available dermatologists" ON dermatologists
  FOR SELECT USING (available = TRUE);

-- Create storage bucket for user scans
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-scans', 'user-scans', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for user-scans bucket
DROP POLICY IF EXISTS "Users can upload own scans" ON storage.objects;
CREATE POLICY "Users can upload own scans" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-scans' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can view own scans" ON storage.objects;
CREATE POLICY "Users can view own scans" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'user-scans' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Public can view scans" ON storage.objects;
CREATE POLICY "Public can view scans" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-scans');

