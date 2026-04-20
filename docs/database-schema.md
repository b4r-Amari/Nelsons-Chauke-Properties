
-- ==========================================
-- Nelson Chauke Properties - Comprehensive Schema
-- ==========================================

-- 1. SETUP: Extensions & Utility Functions
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
-- 2. TABLES
-- ==========================================

-- Admin Users (Links to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now()
);

-- Estate Agents
CREATE TABLE IF NOT EXISTS public.estate_agents (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    phone text,
    photo_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Properties
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES public.estate_agents(id) ON DELETE SET NULL,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    price NUMERIC NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('for-sale', 'to-let', 'sold')),
    type TEXT NOT NULL,
    bedrooms INTEGER NOT NULL DEFAULT 0,
    bathrooms NUMERIC NOT NULL DEFAULT 0,
    floor_size INTEGER DEFAULT 0,
    erf_size INTEGER DEFAULT 0,
    year_built INTEGER,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    video_url TEXT,
    on_show BOOLEAN DEFAULT false,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    author text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    category text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    featured_image text,
    published boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Marketing Leads
CREATE TABLE IF NOT EXISTS public.marketing_leads (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text NOT NULL UNIQUE,
    name text,
    sources text[] NOT NULL DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- Valuation Requests
CREATE TABLE IF NOT EXISTS public.valuation_requests (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    property_details text,
    created_at timestamptz DEFAULT now()
);

-- ==========================================
-- 3. TRIGGERS (Auto-timestamps)
-- ==========================================

CREATE TRIGGER update_estate_agents_modtime BEFORE UPDATE ON public.estate_agents FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_properties_modtime BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_blog_posts_modtime BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ==========================================
-- 4. SECURITY FUNCTIONS (Auth Sync & Admin Check)
-- ==========================================

-- Helper function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid()
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle auto-creating Admin Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Trigger to run the function after a user signs up in Supabase Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_admin_user();

-- ==========================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estate_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_requests ENABLE ROW LEVEL SECURITY;

-- ADMIN POLICIES (Full Access)
CREATE POLICY "Admins can view all admin users" ON public.admin_users FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin full access for agents" ON public.estate_agents FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access for properties" ON public.properties FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access for blogs" ON public.blog_posts FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access for leads" ON public.marketing_leads FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access for valuations" ON public.valuation_requests FOR ALL USING (public.is_admin());

-- PUBLIC POLICIES (Read/Insert Only)
CREATE POLICY "Public read access for agents" ON public.estate_agents FOR SELECT USING (true);
CREATE POLICY "Public read access for properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Public read access for published blogs" ON public.blog_posts FOR SELECT USING (published = true);

-- Lead Capture Security
CREATE POLICY "Public insert access for leads" ON public.marketing_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access for valuations" ON public.valuation_requests FOR INSERT WITH CHECK (true);

-- ==========================================
-- 6. STORAGE SECURITY
-- ==========================================

-- Ensure buckets exist
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('agent-photos', 'agent-photos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-media', 'blog-media', true) ON CONFLICT (id) DO NOTHING;

-- Public Read Access for all files
CREATE POLICY "Public read property-images" ON storage.objects FOR SELECT USING (bucket_id = 'property-images');
CREATE POLICY "Public read agent-photos" ON storage.objects FOR SELECT USING (bucket_id = 'agent-photos');
CREATE POLICY "Public read blog-media" ON storage.objects FOR SELECT USING (bucket_id = 'blog-media');

-- Strict Admin Write Access
CREATE POLICY "Admin manage property-images" ON storage.objects FOR ALL 
USING (bucket_id = 'property-images' AND public.is_admin()) 
WITH CHECK (bucket_id = 'property-images' AND public.is_admin());

CREATE POLICY "Admin manage agent-photos" ON storage.objects FOR ALL 
USING (bucket_id = 'agent-photos' AND public.is_admin()) 
WITH CHECK (bucket_id = 'agent-photos' AND public.is_admin());

CREATE POLICY "Admin manage blog-media" ON storage.objects FOR ALL 
USING (bucket_id = 'blog-media' AND public.is_admin()) 
WITH CHECK (bucket_id = 'blog-media' AND public.is_admin());
