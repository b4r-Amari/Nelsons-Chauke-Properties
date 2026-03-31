
import { createClient } from './supabase/server';
import type { Property, Agent, BlogPost } from '@/lib/types';

const mapDbProperty = (p: any): Property => ({
  id: p.id,
  slug: p.slug || '',
  agentId: p.agent_id,
  agentIds: p.agent_id ? [p.agent_id] : [],
  title: p.title || '',
  address: p.title || '',
  location: p.location || '',
  price: Number(p.price || 0),
  status: p.status || 'for-sale',
  type: p.type || '',
  beds: p.bedrooms || 0,
  baths: Number(p.bathrooms || 0),
  sqft: p.sqft || 0,
  erfSize: p.erf_size || 0,
  yearBuilt: p.year_built,
  description: p.description || '',
  features: Array.isArray(p.features) ? p.features : [],
  imageUrls: Array.isArray(p.image_urls) ? p.image_urls : [],
  isFavorite: p.is_favorite || false,
  onShow: p.on_show || false,
  videoUrl: p.video_url,
  createdAt: p.created_at,
  updatedAt: p.updated_at
});

const mapDbAgent = (a: any): Agent => ({
  id: a.id,
  firstName: a.first_name || '',
  lastName: a.last_name || '',
  name: `${a.first_name || ''} ${a.last_name || ''}`.trim(),
  slug: a.slug || '',
  email: a.email || '',
  phone: a.phone || '',
  imageUrl: a.photo_url || '',
  photoUrl: a.photo_url || '',
  role: a.role || 'Property Agent',
  bio: a.bio || '',
  isActive: a.is_active !== false,
  updatedAt: a.updated_at
});

const mapDbBlogPost = (b: any): BlogPost => ({
  id: b.id,
  title: b.title || '',
  slug: b.slug || '',
  content: b.content || '',
  excerpt: b.excerpt || '',
  category: b.category || 'General',
  author: b.author || 'NC Properties',
  imageUrl: b.featured_image || '',
  published: b.published !== false,
  date: new Date(b.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  createdAt: b.created_at
});

export const getProperties = async (options: { featuredOnly?: boolean; status?: string; limit?: number, onShow?: boolean } = {}): Promise<Property[]> => {
  try {
    const supabase = await createClient();
    let query = supabase.from('properties').select('*');

    if (options.status && options.status !== 'any') {
      if (options.status === 'on-show') {
        query = query.eq('on_show', true);
      } else {
        query = query.eq('status', options.status);
      }
    }

    if (options.featuredOnly) query = query.eq('is_favorite', true);
    if (options.onShow) query = query.eq('on_show', true);
    if (options.limit) query = query.limit(options.limit);

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(mapDbProperty);
  } catch (err: any) {
    console.error('Error fetching properties:', err.message);
    return [];
  }
};

export const getProperty = async (id: string): Promise<Property | null> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapDbProperty(data);
  } catch (err: any) {
    console.error('Error fetching property detail:', err.message);
    return null;
  }
};

export const getAgents = async (): Promise<Agent[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('estate_agents').select('*').eq('is_active', true);
    if (error) throw error;
    return (data || []).map(mapDbAgent);
  } catch (err: any) {
    console.error('Error fetching agents:', err.message);
    return [];
  }
};

export const getAgent = async (slug: string): Promise<Agent | null> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('estate_agents').select('*').eq('slug', slug).single();
    if (error || !data) return null;
    return mapDbAgent(data);
  } catch (err: any) {
    return null;
  }
};

export const getBlogPosts = async (options: { limit?: number } = {}): Promise<BlogPost[]> => {
  try {
    const supabase = await createClient();
    let query = supabase.from('blog_posts').select('*').eq('published', true);
    if (options.limit) query = query.limit(options.limit);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapDbBlogPost);
  } catch (err: any) {
    console.error('Error fetching blogs:', err.message);
    return [];
  }
};

export const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();
    if (error || !data) return null;
    return mapDbBlogPost(data);
  } catch (err: any) {
    return null;
  }
};
