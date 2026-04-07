
-- ==========================================
-- Nelson Chauke Properties - Comprehensive Schema
-- ==========================================

-- 1. SETUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. TABLES

-- Admin Users (Single source of truth for portal access)
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
    slug text UNIQUE,
    email text NOT NULL UNIQUE,
    phone text,
    photo_url text,
    role text DEFAULT 'Property Agent',
    bio text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_estate_agents_modtime BEFORE UPDATE ON public.estate_agents FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Properties
CREATE TABLE public.properties (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id uuid REFERENCES public.estate_agents(id) ON DELETE SET NULL,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text NOT NULL,
    price numeric NOT NULL,
    status text NOT NULL CHECK (status IN ('for-sale', 'to-let', 'sold')) DEFAULT 'for-sale',
    type text NOT NULL,
    bedrooms integer NOT NULL DEFAULT 0,
    bathrooms numeric NOT NULL DEFAULT 0,
    floor_size integer DEFAULT 0,
    erf_size integer DEFAULT 0,
    location text NOT NULL,
    address text,
    features jsonb NOT NULL DEFAULT '[]'::jsonb,
    image_urls text[] DEFAULT '{}'::text[],
    video_url text,
    on_show boolean DEFAULT false,
    is_favorite boolean DEFAULT false,
    year_built integer,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_properties_modtime BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Blog Posts
CREATE TABLE public.blog_posts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    content text NOT NULL,
    excerpt text NOT NULL,
    category text DEFAULT 'Property News',
    author text DEFAULT 'NC Properties',
    featured_image text,
    published boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_blog_posts_modtime BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Marketing Leads
CREATE TABLE public.marketing_leads (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text NOT NULL UNIQUE,
    name text,
    sources text[] DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- Valuation Requests
CREATE TABLE public.valuation_requests (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    property_details text,
    created_at timestamptz DEFAULT now()
);

-- 3. RLS POLICIES
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estate_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_requests ENABLE ROW LEVEL SECURITY;

-- Admin Users Policies
CREATE POLICY "Admins can view admin list" ON public.admin_users FOR SELECT USING (id = auth.uid());

-- Estate Agents Policies
CREATE POLICY "Public read agents" ON public.estate_agents FOR SELECT USING (true);
CREATE POLICY "Admin full access agents" ON public.estate_agents FOR ALL 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- Properties Policies
CREATE POLICY "Public read properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Admin full access properties" ON public.properties FOR ALL 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- Blog Posts Policies
CREATE POLICY "Public read published blog_posts" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admin full access blog_posts" ON public.blog_posts FOR ALL 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- Leads and Requests (Service Role / Admin only)
CREATE POLICY "Public insert leads" ON public.marketing_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert valuations" ON public.valuation_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin view leads" ON public.marketing_leads FOR SELECT USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));
CREATE POLICY "Admin view valuations" ON public.valuation_requests FOR SELECT USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- 4. BUCKETS
-- property-images, agent-photos, blog-media (Ensure these exist in Supabase Dashboard with Public access)
