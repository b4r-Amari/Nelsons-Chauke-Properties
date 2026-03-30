
import { createClient } from './supabase/server';
import type { Property, Agent, BlogPost } from '@/lib/types';

/**
 * Maps a database property row to the Application's Property type.
 * Aligns with the SQL schema provided by the user.
 */
const mapDbProperty = (p: any): Property => ({
  id: p.id,
  slug: p.slug,
  // Agent IDs are retrieved via property_agents join table
  agentIds: p.property_agents ? p.property_agents.map((pa: any) => pa.agent_id) : [],
  title: p.address, // UI uses .title for the main heading
  address: p.address,
  location: p.location,
  price: Number(p.price),
  status: p.status,
  type: p.type,
  bedrooms: p.beds || 0,
  bathrooms: Number(p.baths || 0),
  sqft: p.sqft || 0,
  erfSize: p.erf_size || 0,
  yearBuilt: p.year_built,
  description: p.description || '',
  features: p.features || [],
  imageUrls: p.image_urls || [],
  isFavorite: p.is_favorite || false,
  onShow: p.on_show || false,
  videoUrl: p.video_url,
  latitude: p.latitude ? Number(p.latitude) : undefined,
  longitude: p.longitude ? Number(p.longitude) : undefined,
  createdAt: p.created_at,
  updatedAt: p.updated_at
});

const mapDbAgent = (a: any): Agent => {
  const nameParts = a.name.split(' ');
  return {
    id: a.id,
    name: a.name,
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    slug: a.slug,
    email: a.email,
    phone: a.phone,
    imageUrl: a.image_url,
    photoUrl: a.image_url,
    role: a.role,
    bio: a.bio,
    isActive: a.is_active,
    updatedAt: a.updated_at
  };
};

const mapDbBlogPost = (b: any): BlogPost => ({
  id: b.id,
  title: b.title,
  slug: b.slug,
  content: b.content,
  excerpt: b.excerpt,
  category: b.category,
  author: b.author || 'NC Properties',
  imageUrl: b.image_url,
  date: new Date(b.date || b.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  createdAt: b.created_at
});

export const getProperties = async (options: { featuredOnly?: boolean; status?: string; limit?: number, onShow?: boolean } = {}): Promise<Property[]> => {
  try {
    const supabase = await createClient();
    let query = supabase.from('properties').select('*, property_agents(agent_id)');

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
    
    if (error) {
      console.error('Database error fetching properties:', error.message);
      return [];
    }
    
    return (data || []).map(mapDbProperty);
  } catch (err: any) {
    console.error('Network or initialization error fetching properties:', err.message);
    return [];
  }
};

export const getProperty = async (id: string): Promise<Property | null> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('properties')
      .select('*, property_agents(agent_id)')
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
    if (error) {
      console.error('Error fetching agents:', error.message);
      return [];
    }
    return (data || []).map(mapDbAgent);
  } catch (err: any) {
    console.error('Error initializing agents fetch:', err.message);
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
    let query = supabase.from('blog_posts').select('*');
    if (options.limit) query = query.limit(options.limit);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching blogs:', error.message);
      return [];
    }
    return (data || []).map(mapDbBlogPost);
  } catch (err: any) {
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
