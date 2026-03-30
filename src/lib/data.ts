
import { createClient } from './supabase/server';
import type { Property, Agent, BlogPost } from '@/lib/types';

const mapDbProperty = (p: any): Property => ({
  id: p.id,
  agentId: p.agent_id,
  title: p.title,
  description: p.description,
  price: Number(p.price),
  status: p.status,
  type: p.type,
  bedrooms: p.bedrooms,
  bathrooms: Number(p.bathrooms),
  location: p.location,
  sqft: p.sqft || 0,
  erfSize: p.erf_size || 0,
  yearBuilt: p.year_built,
  features: p.features || [],
  imageUrls: p.image_urls || [],
  isFavorite: p.is_favorite,
  onShow: p.on_show,
  videoUrl: p.video_url,
  published: p.published,
  createdAt: p.created_at,
  updatedAt: p.updated_at
});

const mapDbAgent = (a: any): Agent => ({
  id: a.id,
  firstName: a.first_name,
  lastName: a.last_name,
  name: `${a.first_name} ${a.last_name}`,
  slug: a.slug,
  email: a.email,
  phone: a.phone,
  photoUrl: a.photo_url,
  imageUrl: a.photo_url, // for legacy support
  bio: a.bio,
  isActive: a.is_active,
  updatedAt: a.updated_at
});

const mapDbBlogPost = (b: any): BlogPost => ({
  id: b.id,
  title: b.title,
  slug: b.slug,
  content: b.content,
  excerpt: b.excerpt,
  category: b.category,
  featuredImage: b.featured_image,
  imageUrl: b.featured_image, // for legacy support
  published: b.published,
  date: new Date(b.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  author: 'NC Properties', // Default author if not in schema
  createdAt: b.created_at,
  updatedAt: b.updated_at
});

export const getProperties = async (options: { featuredOnly?: boolean; status?: string; limit?: number, onShow?: boolean } = {}): Promise<Property[]> => {
  const supabase = await createClient();
  let query = supabase.from('properties').select('*');

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
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return mapDbProperty(data);
};

export const getAgents = async (): Promise<Agent[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('estate_agents').select('*').eq('is_active', true);
  if (error) {
    console.error('Error fetching agents:', error.message);
    return [];
  }
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
  let query = supabase.from('blog_posts').select('*').eq('published', true);
  if (options.limit) query = query.limit(options.limit);
  
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching blogs:', error.message);
    return [];
  }
  return data.map(mapDbBlogPost);
};

export const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();
  if (error || !data) return null;
  return mapDbBlogPost(data);
};
