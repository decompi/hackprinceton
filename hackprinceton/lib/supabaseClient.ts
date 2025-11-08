import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log("TEST", supabaseUrl, supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and Anon Key must be set in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  name: string | null;
  email: string;
  profile_pic: string | null;
  created_at: string;
}

export interface Scan {
  id: string;
  user_id: string;
  image_url: string;
  acne_type: string | null;
  causes: string[] | null;
  confidence: number | null;
  analysis_date: string;
}

export interface Dermatologist {
  id: string;
  name: string;
  specialty: string;
  email: string | null;
  phone: string | null;
  bio: string | null;
  location: string | null;
  available: boolean;
}

export interface Appointment {
  id: string;
  user_id: string;
  dermatologist_id: string;
  scan_id: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduled_at: string | null;
  created_at: string;
}

