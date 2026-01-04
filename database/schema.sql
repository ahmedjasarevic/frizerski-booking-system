-- Frizerski Booking System - Database Schema
-- Run this in your Supabase SQL Editor

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  duration INTEGER, -- in minutes
  icon VARCHAR(10) DEFAULT '💇',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(service_id, date, time) -- Prevent double booking
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_service ON appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_datetime ON appointments(date, time);

-- Enable Row Level Security (RLS)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policies for services (public read access)
CREATE POLICY "Services are viewable by everyone" ON services
  FOR SELECT USING (true);

-- Policies for appointments (public insert, admin read)
CREATE POLICY "Anyone can create appointments" ON appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Appointments are viewable by everyone" ON appointments
  FOR SELECT USING (true);

-- Function to get available time slots for a date and service
CREATE OR REPLACE FUNCTION get_available_slots(p_date DATE, p_service INTEGER)
RETURNS TABLE(slot TIME) AS $$
DECLARE
  all_slots TIME[] := ARRAY[
    '09:00'::TIME, '09:30'::TIME, '10:00'::TIME, '10:30'::TIME,
    '11:00'::TIME, '11:30'::TIME, '12:00'::TIME, '12:30'::TIME,
    '13:00'::TIME, '13:30'::TIME, '14:00'::TIME, '14:30'::TIME,
    '15:00'::TIME, '15:30'::TIME, '16:00'::TIME, '16:30'::TIME,
    '17:00'::TIME, '17:30'::TIME
  ];
  booked_slots TIME[];
BEGIN
  -- Get all booked slots for this date and service
  SELECT ARRAY_AGG(time) INTO booked_slots
  FROM appointments
  WHERE date = p_date AND service_id = p_service;

  -- Return slots that are not booked
  RETURN QUERY
  SELECT unnest(all_slots) AS slot
  WHERE unnest(all_slots) NOT IN (SELECT unnest(COALESCE(booked_slots, ARRAY[]::TIME[])))
  ORDER BY slot;
END;
$$ LANGUAGE plpgsql;

-- Insert sample services
INSERT INTO services (name, description, price, duration, icon) VALUES
  ('Šišanje muško', 'Profesionalno šišanje za muškarce', 15.00, 30, '✂️'),
  ('Šišanje žensko', 'Moderno šišanje za žene', 25.00, 60, '💇‍♀️'),
  ('Farbanje', 'Kompletno farbanje kose', 45.00, 120, '🎨'),
  ('Pramenovi', 'Farbanje pramenova', 35.00, 90, '✨'),
  ('Frizura', 'Svečana frizura', 30.00, 60, '💫'),
  ('Brijanje', 'Klasično brijanje', 10.00, 20, '🪒')
ON CONFLICT DO NOTHING;
