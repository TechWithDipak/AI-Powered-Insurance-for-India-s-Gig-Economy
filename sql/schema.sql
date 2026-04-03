-- Run this in the Supabase SQL Editor

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  phone TEXT,
  platform TEXT,
  work_type TEXT,
  shift_timing TEXT,
  location TEXT,
  active_plan TEXT DEFAULT 'None',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE policies (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE,
  description TEXT,
  base_price NUMERIC,
  icon TEXT
);

INSERT INTO policies (name, description, base_price, icon) VALUES 
('Aarambh', 'Start / basic coverage. Covers Heavy Rain only.', 20, '🟢'),
('Rakshak', 'Protector. Covers Rain & Pollution. AI pricing applied.', 30, '🟡'),
('Mahakavach', 'Ultimate protection. Covers Rain, AQI, Traffic, Strikes.', 45, '🔴');

CREATE TABLE claims (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT,
  amount NUMERIC,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Turn on RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
-- Allow users to insert/update their own profile
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow public read on policies
CREATE POLICY "Public read policies" ON policies FOR SELECT USING (true);

-- Allow users to read their own claims
CREATE POLICY "Users can read own claims" ON claims FOR SELECT USING (auth.uid() = user_id);
-- Allow inserts for automation logic
CREATE POLICY "Users and backend can insert claims" ON claims FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
