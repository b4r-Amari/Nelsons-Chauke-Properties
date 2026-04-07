
import { createClient } from './supabase/server';
import type { Property, Agent, BlogPost } from '@/lib/types';

/**
 * Validates if a string is a valid UUID to prevent Postgres query errors.
 */
const isValidUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const mapDbProperty = (p: any): Property => ({
  id: String(p.id),
  agentId: p.agent_id,
  title: p.title || '',
  description: p.description || '',
  price: Number(p.price || 0),
  status: p.status || 'for-sale',
  type: p.type || '',
  bedrooms: p.bedrooms || 0,
  bathrooms: Number(p.bathrooms || 0),
  location: p.location || '',
  address: p.address || p.title || '',
  floorSize: p.floor_size || 0,
  erfSize: p.erf_size || 0,
  features: Array.isArray(p.features) ? p.features : [],
  imageUrls: Array.isArray(p.image_urls) ? p.image_urls.filter((url: any) => typeof url === 'string' && url.trim().length > 0) : [],
  videoUrl: p.video_url || null,
  onShow: p.on_show || false,
  isFavorite: p.is_favorite || false,
  yearBuilt: p.year_built,
  slug: p.slug || String(p.id),
  createdAt: p.created_at,
  updatedAt: p.updated_at
});

const mapDbAgent = (a: any): Agent => ({
  id: String(a.id),
  firstName: a.first_name || '',
  lastName: a.last_name || '',
  name: `${a.first_name || ''} ${a.last_name || ''}`.trim(),
  email: a.email || '',
  phone: a.phone || '',
  photoUrl: a.photo_url && a.photo_url.trim().length > 0 ? a.photo_url : null,
  updatedAt: a.updated_at,
  slug: a.slug || String(a.id),
  role: a.role || 'Property Agent',
  bio: a.bio || ''
});

const mapDbBlogPost = (b: any): BlogPost => ({
  id: String(b.id),
  title: b.title || '',
  slug: b.slug || '',
  content: b.content || '',
  excerpt: b.excerpt || '',
  category: b.category || 'General',
  author: b.author || 'NC Properties',
  imageUrl: b.featured_image && b.featured_image.trim().length > 0 ? b.featured_image : null,
  published: b.published !== false,
  date: new Date(b.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  createdAt: b.created_at,
  updatedAt: b.updated_at
});

export const getProperties = async (options: { featuredOnly?: boolean; status?: string; limit?: number; onShow?: boolean; agentId?: string } = {}): Promise<Property[]> => {
  try {
    const supabase = await createClient();
    let query = supabase.from('properties').select('*');

    if (options.status && options.status !== 'any') {
      query = query.eq('status', options.status);
    }
    
    if (options.featuredOnly) {
      query = query.eq('is_favorite', true); 
    }

    if (options.onShow) {
      query = query.eq('on_show', true);
    }

    if (options.agentId && isValidUuid(options.agentId)) {
      query = query.eq('agent_id', options.agentId);
    }

    if (options.limit) query = query.limit(options.limit);

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(mapDbProperty);
  } catch (err: any) {
    console.error('Error in getProperties:', err.message);
    return [];
  }
};

export const getProperty = async (id: string): Promise<Property | null> => {
  try {
    if (!isValidUuid(id)) {
        // Fallback: try finding by slug if the ID isn't a valid UUID
        const supabase = await createClient();
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('slug', id)
          .maybeSingle();
        if (error || !data) return null;
        return mapDbProperty(data);
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapDbProperty(data);
  } catch (err: any) {
    return null;
  }
};

export const getAgents = async (): Promise<Agent[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('estate_agents').select('*');
    if (error) throw error;
    return (data || []).map(mapDbAgent);
  } catch (err: any) {
    console.error('Error fetching agents:', err.message);
    return [];
  }
};

export const getAgent = async (slugOrId: string): Promise<Agent | null> => {
  try {
    const supabase = await createClient();
    const isUuid = isValidUuid(slugOrId);
    
    let query = supabase.from('estate_agents').select('*');
    
    if (isUuid) {
      query = query.eq('id', slugOrId);
    } else {
      query = query.eq('slug', slugOrId);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) return null;
    return mapDbAgent(data);
  } catch (err: any) {
    return null;
  }
};

export const getAgentById = async (id: string): Promise<Agent | null> => {
  try {
    if (!isValidUuid(id)) return null;
    const supabase = await createClient();
    const { data, error } = await supabase.from('estate_agents').select('*').eq('id', id).single();
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

export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    if (!isValidUuid(id)) return null;
    const supabase = await createClient();
    const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
    if (error || !data) return null;
    return mapDbBlogPost(data);
  } catch (err: any) {
    return null;
  }
};
