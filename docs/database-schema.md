
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
-- 2. TABLES & TRIGGERS
-- ==========================================

-- Admin Users (Links to Supabase Auth)
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

CREATE TRIGGER update_estate_agents_modtime 
BEFORE UPDATE ON public.estate_agents 
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

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
    features jsonb,
    image_urls text[],
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_properties_modtime 
BEFORE UPDATE ON public.properties 
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

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

CREATE TRIGGER update_blog_posts_modtime 
BEFORE UPDATE ON public.blog_posts 
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Marketing Leads (Newsletter/Alerts)
CREATE TABLE public.marketing_leads (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text NOT NULL UNIQUE,
    name text,
    sources text[] NOT NULL DEFAULT '{}',
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

-- ==========================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estate_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_requests ENABLE ROW LEVEL SECURITY;

-- Admin Users Policies: 
CREATE POLICY "Admins can view their own status" ON public.admin_users FOR SELECT USING (auth.uid() = id);

-- Estate Agents Policies:
CREATE POLICY "Public read access for agents" ON public.estate_agents FOR SELECT USING (true);
CREATE POLICY "Admin full access for agents" ON public.estate_agents USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- Properties Policies:
CREATE POLICY "Public read access for properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Admin full access for properties" ON public.properties USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- Blog Posts Policies:
CREATE POLICY "Public read access for published blogs" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admin full access for blogs" ON public.blog_posts USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- Marketing Leads Policies:
CREATE POLICY "Public insert access for leads" ON public.marketing_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access for leads" ON public.marketing_leads USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- Valuation Requests Policies:
CREATE POLICY "Public insert access for valuations" ON public.valuation_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access for valuations" ON public.valuation_requests USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- ==========================================
-- 4. STORAGE BUCKETS
-- ==========================================

-- Create public buckets for your assets
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('agent-photos', 'agent-photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-media', 'blog-media', true);

-- Enable public read access for the buckets
CREATE POLICY "Public read property-images" ON storage.objects FOR SELECT USING (bucket_id = 'property-images');
CREATE POLICY "Public read agent-photos" ON storage.objects FOR SELECT USING (bucket_id = 'agent-photos');
CREATE POLICY "Public read blog-media" ON storage.objects FOR SELECT USING (bucket_id = 'blog-media');

-- Allow authenticated admins to upload/modify these buckets
CREATE POLICY "Admins full access property-images" ON storage.objects USING (bucket_id = 'property-images' AND EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));
CREATE POLICY "Admins full access agent-photos" ON storage.objects USING (bucket_id = 'agent-photos' AND EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));
CREATE POLICY "Admins full access blog-media" ON storage.objects USING (bucket_id = 'blog-media' AND EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));
