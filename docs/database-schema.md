
-- 1. DROP EVERYTHING (Fresh Start)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.is_admin();

DROP TABLE IF EXISTS public.property_agents CASCADE;
DROP TABLE IF EXISTS public.enquiries CASCADE;
DROP TABLE IF EXISTS public.valuation_requests CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TABLE IF EXISTS public.estate_agents CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TYPE IF EXISTS property_status;

-- 2. CUSTOM TYPES
CREATE TYPE property_status AS ENUM ('for-sale', 'to-let', 'sold');

-- 3. TABLES

-- Users: Synced with Supabase Auth
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    photo_url TEXT, -- Link to Supabase Storage avatar
    is_admin BOOLEAN DEFAULT false,
    signup_sources TEXT[] DEFAULT ARRAY['web'], 
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Estate Agents
CREATE TABLE public.estate_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    role TEXT,
    image_url TEXT, -- Link to Supabase Storage
    phone TEXT,
    email TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Properties
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL,
    price NUMERIC NOT NULL,
    status property_status NOT NULL DEFAULT 'for-sale',
    type TEXT,
    beds INTEGER,
    baths INTEGER,
    sqft INTEGER,
    erf_size INTEGER,
    year_built INTEGER,
    description TEXT,
    features TEXT[],
    image_urls TEXT[], -- Array of links to Supabase Storage
    is_favorite BOOLEAN DEFAULT false,
    on_show BOOLEAN DEFAULT false,
    video_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Join Table (Properties <-> Agents)
CREATE TABLE public.property_agents (
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.estate_agents(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, agent_id)
);

-- Blog Posts
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    author TEXT,
    date TIMESTAMPTZ DEFAULT now(),
    image_url TEXT, -- Link to Supabase Storage
    category TEXT,
    excerpt TEXT,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enquiries (Lead Capture)
CREATE TABLE public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    source TEXT DEFAULT 'contact-form',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Valuation Requests
CREATE TABLE public.valuation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. SECURITY & AUTH FUNCTIONS

-- Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT is_admin FROM public.users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Auto-create profile when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, photo_url)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. ROW LEVEL SECURITY (RLS)

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estate_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_requests ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ ACCESS (For your website visitors)
CREATE POLICY "Allow public read" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.estate_agents FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.property_agents FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.blog_posts FOR SELECT USING (true);

-- LEAD CAPTURE (Anyone can insert, only admin can read/manage)
CREATE POLICY "Public insert enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage enquiries" ON public.enquiries FOR ALL USING (is_admin());

CREATE POLICY "Public insert valuations" ON public.valuation_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage valuations" ON public.valuation_requests FOR ALL USING (is_admin());

-- USER PROFILES
CREATE POLICY "Users view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON public.users FOR SELECT USING (is_admin());

-- ADMIN FULL ACCESS (Write/Update/Delete everything)
CREATE POLICY "Admin manage properties" ON public.properties FOR ALL USING (is_admin());
CREATE POLICY "Admin manage agents" ON public.estate_agents FOR ALL USING (is_admin());
CREATE POLICY "Admin manage property_agents" ON public.property_agents FOR ALL USING (is_admin());
CREATE POLICY "Admin manage blog" ON public.blog_posts FOR ALL USING (is_admin());
