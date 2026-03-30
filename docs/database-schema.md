
-- 1. DROP EVERYTHING (Fresh Start)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.is_admin();

DROP TABLE IF EXISTS public.valuation_requests CASCADE;
DROP TABLE IF EXISTS public.marketing_leads CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TABLE IF EXISTS public.estate_agents CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;
DROP TYPE IF EXISTS public.property_status CASCADE;

-- 2. CUSTOM TYPES
CREATE TYPE public.property_status AS ENUM ('for-sale', 'to-let', 'sold');

-- 3. TABLES

-- Admin Users (Authorized IDs from Supabase Auth)
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Estate Agents
CREATE TABLE public.estate_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    photo_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Properties
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES public.estate_agents(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    status public.property_status NOT NULL DEFAULT 'for-sale',
    type TEXT NOT NULL,
    bedrooms INTEGER NOT NULL DEFAULT 0,
    bathrooms NUMERIC NOT NULL DEFAULT 0,
    location TEXT NOT NULL,
    sqft INTEGER DEFAULT 0,
    erf_size INTEGER DEFAULT 0,
    year_built INTEGER,
    features JSONB,
    image_urls TEXT[],
    is_favorite BOOLEAN DEFAULT false,
    on_show BOOLEAN DEFAULT false,
    video_url TEXT,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Blog Posts
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    category TEXT,
    featured_image TEXT,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Marketing Leads
CREATE TABLE public.marketing_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    sources TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Valuation Requests
CREATE TABLE public.valuation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    property_details TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. SECURITY & AUTH FUNCTIONS

-- Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. ROW LEVEL SECURITY (RLS)

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estate_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_requests ENABLE ROW LEVEL SECURITY;

-- Public Read Access
CREATE POLICY "Allow public read on agents" ON public.estate_agents FOR SELECT USING (true);
CREATE POLICY "Allow public read on properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Allow public read on blog" ON public.blog_posts FOR SELECT USING (true);

-- Lead Capture (Public Insert)
CREATE POLICY "Allow public insert on leads" ON public.marketing_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on valuations" ON public.valuation_requests FOR INSERT WITH CHECK (true);

-- Admin Full Access
CREATE POLICY "Admin manage everything" ON public.estate_agents FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage everything" ON public.properties FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage everything" ON public.blog_posts FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage everything" ON public.admin_users FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage everything" ON public.marketing_leads FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin manage everything" ON public.valuation_requests FOR SELECT USING (public.is_admin());
