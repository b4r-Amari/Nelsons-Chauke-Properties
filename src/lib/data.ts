
import { createClient } from './supabase/server';
import type { Property } from '@/lib/types';
import type { Agent } from '@/components/shared/agent-card';
import type { BlogPost } from '@/components/shared/blog-card';

const mapDbProperty = (p: any): Property => ({
  id: p.id,
  slug: p.slug,
  imageUrl: p.image_urls?.[0] || '',
  price: Number(p.price),
  address: p.address,
  beds: p.beds,
  baths: p.baths,
  sqft: p.sqft,
  erfSize: p.erf_size,
  isFavorite: p.is_favorite,
  status: p.status,
  type: p.type,
  location: p.location,
  description: p.description,
  features: p.features || [],
  yearBuilt: p.year_built,
  onShow: p.on_show,
  agentIds: p.property_agents?.map((pa: any) => pa.agent_id) || [],
  videoUrl: p.video_url,
  createdAt: p.created_at,
  updatedAt: p.updated_at
});

const mapDbAgent = (a: any): Agent => ({
  id: a.id,
  slug: a.slug,
  name: a.name,
  role: a.role,
  imageUrl: a.image_url,
  phone: a.phone,
  email: a.email,
  bio: a.bio,
  updatedAt: a.created_at
});

const mapDbBlogPost = (b: any): BlogPost => ({
  id: b.id,
  slug: b.slug,
  title: b.title,
  author: b.author,
  date: new Date(b.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  imageUrl: b.image_url,
  excerpt: b.excerpt,
  content: b.content,
  category: b.category,
  updatedAt: b.created_at
});

export const getProperties = async (options: { featuredOnly?: boolean; status?: string; limit?: number, onShow?: boolean } = {}): Promise<Property[]> => {
  const supabase = await createClient();
  let query = supabase.from('properties').select('*, property_agents(agent_id)');

  if (options.status && options.status !== 'any') {
    query = query.eq('status', options.status);
  }

  if (options.featuredOnly) query = query.eq('is_favorite', true);
  if (options.onShow) query = query.eq('on_show', true);
  if (options.limit) query = query.limit(options.limit);

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching properties:', error.message);
    return [];
  }
  return data.map(mapDbProperty);
};

export const getProperty = async (id: string): Promise<Property | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('properties')
    .select('*, property_agents(agent_id)')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return mapDbProperty(data);
};

export const getAgents = async (): Promise<Agent[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('estate_agents').select('*').eq('is_active', true);
  if (error) return [];
  return data.map(mapDbAgent);
};

export const getAgent = async (slug: string): Promise<Agent | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('estate_agents').select('*').eq('slug', slug).single();
  if (error || !data) return null;
  return mapDbAgent(data);
};

export const getBlogPosts = async (options: { limit?: number } = {}): Promise<BlogPost[]> => {
  const supabase = await createClient();
  let query = supabase.from('blog_posts').select('*').order('date', { ascending: false });
  if (options.limit) query = query.limit(options.limit);
  const { data, error } = await query;
  if (error) return [];
  return data.map(mapDbBlogPost);
};

export const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();
  if (error || !data) return null;
  return mapDbBlogPost(data);
};
