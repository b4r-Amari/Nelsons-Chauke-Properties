
-- ==========================================
-- 1. SETUP: Extensions & Utility Functions
-- ==========================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a function to automatically update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==========================================
-- 2. CUSTOM TYPES
-- ==========================================
DO $$ BEGIN
    CREATE TYPE property_status AS ENUM ('for-sale', 'to-let', 'sold');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==========================================
-- 3. TABLES
-- ==========================================

-- Users: Synced with Supabase Auth
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    password TEXT, -- For custom storage if needed, though Supabase Auth handles it securely
    display_name TEXT,
    photo_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    signup_sources TEXT[] DEFAULT ARRAY['web'], 
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Estate Agents
CREATE TABLE IF NOT EXISTS public.estate_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_estate_agents_modtime 
BEFORE UPDATE ON public.estate_agents 
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Properties
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES public.estate_agents(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    status property_status NOT NULL DEFAULT 'for-sale',
    type TEXT NOT NULL,
    bedrooms INTEGER NOT NULL DEFAULT 0,
    bathrooms NUMERIC NOT NULL DEFAULT 0,
    location TEXT NOT NULL,
    features JSONB DEFAULT '[]',
    image_urls TEXT[] DEFAULT '{}',
    on_show BOOLEAN DEFAULT false,
    is_favorite BOOLEAN DEFAULT false,
    video_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_properties_modtime 
BEFORE UPDATE ON public.properties 
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    featured_image TEXT,
    author TEXT DEFAULT 'NC Properties',
    category TEXT DEFAULT 'General',
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_blog_posts_modtime 
BEFORE UPDATE ON public.blog_posts 
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Marketing Leads
CREATE TABLE IF NOT EXISTS public.marketing_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    sources TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Valuation Requests
CREATE TABLE IF NOT EXISTS public.valuation_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    property_details TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 4. SECURITY & AUTH FUNCTIONS
-- ==========================================

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
  INSERT INTO public.users (id, email, username, display_name, photo_url)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'username', new.email),
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estate_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Allow public read agents" ON public.estate_agents FOR SELECT USING (true);
CREATE POLICY "Allow public read blogs" ON public.blog_posts FOR SELECT USING (published = true);

CREATE POLICY "Admin full access properties" ON public.properties FOR ALL USING (is_admin());
CREATE POLICY "Admin full access agents" ON public.estate_agents FOR ALL USING (is_admin());
CREATE POLICY "Admin full access blogs" ON public.blog_posts FOR ALL USING (is_admin());

CREATE POLICY "Public insert leads" ON public.marketing_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert valuations" ON public.valuation_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Users view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON public.users FOR SELECT USING (is_admin());
