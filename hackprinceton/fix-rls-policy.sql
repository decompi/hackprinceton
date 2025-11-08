-- Fix RLS Policy for Users Table
-- Run this in Supabase SQL Editor to add INSERT policy

-- Add INSERT policy for users table
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

