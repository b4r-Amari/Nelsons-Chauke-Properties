-- ==========================================
-- 1. SETUP & EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to handle 'updated_at' timestamps
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

-- Admin Users (Source of truth for Admin Portal access)
CREATE TABLE public.admin_users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now()
);

-- Estate Agents
CREATE TABLE public.estate_agents (
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
CREATE TABLE public.properties (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id uuid REFERENCES public.estate_agents(id) ON DELETE SET NULL,
    title text NOT NULL,
    description text NOT NULL,
    price numeric NOT NULL,
    status text CHECK (status IN ('for-sale', 'to-let', 'sold')),
    type text NOT NULL,
    bedrooms integer NOT NULL DEFAULT 0,
    bathrooms numeric NOT NULL DEFAULT 0,
    location text NOT NULL,
    features jsonb DEFAULT '{}'::jsonb,
    image_urls text[] DEFAULT '{}'::text[],
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Blog Posts
CREATE TABLE public.blog_posts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    content text NOT NULL,
    featured_image text,
    published boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Marketing Leads & Valuation Requests
CREATE TABLE public.marketing_leads (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text NOT NULL UNIQUE,
    name text,
    sources text[] DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

CREATE TABLE public.valuation_requests (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    property_details text,
    created_at timestamptz DEFAULT now()
);

-- ==========================================
-- 3. THE AUTH BRIDGE (Automatic Admin Creation)
-- ==========================================

-- This function automatically adds a new user to public.admin_users 
-- whenever they are created in Supabase Auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.admin_users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created in the auth schema
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 4. SECURITY (RLS)
-- ==========================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estate_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_requests ENABLE ROW LEVEL SECURITY;

-- ADMIN CHECK HELPER: Used in policies below
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid());
$$ LANGUAGE sql SECURITY DEFINER;

-- Policies
CREATE POLICY "Public read agents/props/blogs" ON public.estate_agents FOR SELECT USING (true);
CREATE POLICY "Public read agents/props/blogs" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Public read agents/props/blogs" ON public.blog_posts FOR SELECT USING (published = true);

CREATE POLICY "Admin full access agents" ON public.estate_agents USING (is_admin());
CREATE POLICY "Admin full access properties" ON public.properties USING (is_admin());
CREATE POLICY "Admin full access blogs" ON public.blog_posts USING (is_admin());

CREATE POLICY "Public insert leads" ON public.marketing_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert valuations" ON public.valuation_requests FOR INSERT WITH CHECK (true);

-- ==========================================
-- 5. TIMESTAMPS
-- ==========================================
CREATE TRIGGER update_estate_agents_modtime BEFORE UPDATE ON public.estate_agents FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_properties_modtime BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_blog_posts_modtime BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION update_modified_column();
