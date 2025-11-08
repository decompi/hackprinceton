-- Seed Data for AcneScan App
-- Run this in Supabase SQL Editor after creating the schema

-- Insert sample dermatologists
INSERT INTO dermatologists (name, specialty, email, phone, bio, location, available)
VALUES
  (
    'Dr. Sarah Johnson',
    'Acne & Dermatology',
    'sarah.johnson@acnescan.com',
    '555-0101',
    'Board-certified dermatologist with over 10 years of experience specializing in acne treatment and skin care. Dr. Johnson has helped thousands of patients achieve clearer, healthier skin through personalized treatment plans.',
    'New York, NY - Telehealth Available',
    true
  ),
  (
    'Dr. Michael Chen',
    'Cosmetic Dermatology',
    'michael.chen@acnescan.com',
    '555-0102',
    'Award-winning cosmetic dermatologist with 15+ years of experience. Specializes in acne scar treatment, laser therapy, and advanced skincare solutions. Known for his patient-centered approach and excellent results.',
    'Los Angeles, CA - Telehealth Available',
    true
  ),
  (
    'Dr. Emily Rodriguez',
    'Acne Treatment',
    'emily.rodriguez@acnescan.com',
    '555-0103',
    'Expert in treating various forms of acne including hormonal, cystic, and adult acne. Dr. Rodriguez combines medical expertise with a compassionate approach to help patients regain confidence in their skin.',
    'Chicago, IL - In-Person Only',
    true
  ),
  (
    'Dr. James Wilson',
    'General Dermatology',
    'james.wilson@acnescan.com',
    '555-0104',
    'Experienced dermatologist with 12 years in practice. Specializes in general dermatology with a focus on acne, eczema, and skin conditions. Provides comprehensive care for patients of all ages.',
    'Houston, TX - Telehealth Available',
    true
  ),
  (
    'Dr. Lisa Anderson',
    'Acne & Skin Care',
    'lisa.anderson@acnescan.com',
    '555-0105',
    'Renowned dermatologist with 20+ years of experience in acne treatment and preventive skincare. Dr. Anderson is a published researcher and has developed innovative treatment protocols for persistent acne.',
    'Miami, FL - Telehealth Available',
    true
  ),
  (
    'Dr. David Kim',
    'Dermatology',
    'david.kim@acnescan.com',
    '555-0106',
    'Board-certified dermatologist specializing in medical and surgical dermatology. Dr. Kim has extensive experience treating severe acne cases and is known for his thorough diagnostic approach.',
    'Seattle, WA - Telehealth Available',
    true
  ),
  (
    'Dr. Jennifer Martinez',
    'Acne & Rosacea',
    'jennifer.martinez@acnescan.com',
    '555-0107',
    'Specialist in acne and rosacea treatment with 8 years of experience. Dr. Martinez focuses on creating personalized treatment plans that address both the physical and emotional aspects of skin conditions.',
    'San Francisco, CA - Telehealth Available',
    true
  ),
  (
    'Dr. Robert Taylor',
    'Pediatric Dermatology',
    'robert.taylor@acnescan.com',
    '555-0108',
    'Pediatric dermatologist with expertise in treating acne in adolescents and young adults. Dr. Taylor combines medical knowledge with a gentle, understanding approach to help young patients feel comfortable.',
    'Boston, MA - In-Person Only',
    true
  ),
  (
    'Dr. Amanda White',
    'Acne & Hormonal Skin Issues',
    'amanda.white@acnescan.com',
    '555-0109',
    'Expert in hormonal acne and skin conditions related to hormonal imbalances. Dr. White takes a holistic approach, considering diet, lifestyle, and hormonal factors in her treatment plans.',
    'Denver, CO - Telehealth Available',
    true
  ),
  (
    'Dr. Christopher Brown',
    'Dermatology & Acne Surgery',
    'christopher.brown@acnescan.com',
    '555-0110',
    'Dermatologist and dermatologic surgeon specializing in severe acne cases requiring surgical intervention. Dr. Brown has performed hundreds of successful acne surgery procedures.',
    'Phoenix, AZ - Telehealth Available',
    true
  )
ON CONFLICT DO NOTHING;

-- Verify the data was inserted
SELECT COUNT(*) as total_dermatologists FROM dermatologists WHERE available = true;

