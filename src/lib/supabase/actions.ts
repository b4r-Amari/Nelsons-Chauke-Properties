
'use server';

import { createClient } from './server';
import { revalidatePath } from 'next/cache';

/**
 * Uploads a file to a Supabase storage bucket and returns the public URL.
 */
export async function uploadFile(bucket: string, file: File) {
  const supabase = await createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) return { success: false, error: error.message };

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return { success: true, url: urlData.publicUrl };
}

export async function addProperty(formData: any) {
  const supabase = await createClient();
  
  const propertyData = {
    agent_id: formData.agentId || null,
    title: formData.title,
    description: formData.description,
    price: Number(formData.price),
    status: formData.status,
    type: formData.type,
    bedrooms: Number(formData.bedrooms || 0),
    bathrooms: Number(formData.bathrooms || 0),
    location: formData.location,
    features: Array.isArray(formData.features) ? formData.features : [],
    image_urls: formData.imageUrls || [],
    floor_size: Number(formData.floorSize || 0),
    erf_size: Number(formData.erfSize || 0),
    on_show: formData.onShow || false,
    is_favorite: formData.isFavorite || false,
    year_built: formData.yearBuilt || null,
    slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
    video_url: formData.videoUrl || null
  };

  const { data, error } = await supabase.from('properties').insert([propertyData]).select().single();

  if (error) {
    console.error('Error adding property:', error);
    return { success: false, error: error.message };
  }
  
  revalidatePath('/admin/properties');
  revalidatePath('/properties');
  return { success: true, data };
}

export async function updateProperty(id: string, formData: any) {
  const supabase = await createClient();
  
  const dbData: any = {};
  if (formData.title !== undefined) dbData.title = formData.title;
  if (formData.location !== undefined) dbData.location = formData.location;
  if (formData.price !== undefined) dbData.price = Number(formData.price);
  if (formData.status !== undefined) dbData.status = formData.status;
  if (formData.type !== undefined) dbData.type = formData.type;
  if (formData.bedrooms !== undefined) dbData.bedrooms = Number(formData.bedrooms);
  if (formData.bathrooms !== undefined) dbData.bathrooms = Number(formData.bathrooms);
  if (formData.description !== undefined) dbData.description = formData.description;
  if (formData.features !== undefined) dbData.features = Array.isArray(formData.features) ? formData.features : [];
  if (formData.imageUrls !== undefined) dbData.image_urls = formData.imageUrls;
  if (formData.agentId !== undefined) dbData.agent_id = formData.agentId || null;
  if (formData.onShow !== undefined) dbData.on_show = formData.onShow;
  if (formData.isFavorite !== undefined) dbData.is_favorite = formData.isFavorite;
  if (formData.videoUrl !== undefined) dbData.video_url = formData.videoUrl;
  if (formData.floorSize !== undefined) dbData.floor_size = Number(formData.floorSize || 0);
  if (formData.erfSize !== undefined) dbData.erf_size = Number(formData.erfSize || 0);
  if (formData.yearBuilt !== undefined) dbData.year_built = formData.yearBuilt ? Number(formData.yearBuilt) : null;

  const { error } = await supabase.from('properties').update(dbData).eq('id', id);
  if (error) {
    console.error('Error updating property:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/properties');
  revalidatePath(`/properties/${id}`);
  return { success: true };
}

export async function deleteProperty(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/admin/properties');
  return { success: true };
}

export async function addAgent(formData: any) {
  const supabase = await createClient();
  const dbData = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    photo_url: formData.photoUrl,
  };

  const { data, error } = await supabase.from('estate_agents').insert([dbData]).select().single();
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/admin/agents');
  revalidatePath('/about-us');
  return { success: true, data };
}

export async function updateAgent(id: string, formData: any) {
  const supabase = await createClient();
  const dbData: any = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    photo_url: formData.photoUrl
  };

  const { error } = await supabase.from('estate_agents').update(dbData).eq('id', id);
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/admin/agents');
  revalidatePath('/about-us');
  return { success: true };
}

export async function deleteAgent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('estate_agents').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/admin/agents');
  return { success: true };
}

export async function addMarketingLead(lead: { email: string; name?: string; source: string }) {
  const supabase = await createClient();
  
  const { data: existing } = await supabase
    .from('marketing_leads')
    .select('sources')
    .eq('email', lead.email)
    .maybeSingle();

  const sources = existing ? Array.from(new Set([...(existing.sources || []), lead.source])) : [lead.source];

  const { error } = await supabase.from('marketing_leads').upsert({
    email: lead.email,
    name: lead.name,
    sources: sources
  }, { onConflict: 'email' });
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function addValuationRequest(request: any) {
  const supabase = await createClient();
  const dbData = {
    name: request.fullName || request.name,
    email: request.email,
    phone: request.phone,
    property_details: request.propertyAddress || request.address
  };

  const { error } = await supabase.from('valuation_requests').insert([dbData]);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function addBlogPost(formData: any) {
  const supabase = await createClient();
  const dbData = {
    title: formData.title,
    slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
    content: formData.content,
    featured_image: formData.imageUrl,
    published: formData.published ?? true,
  };

  const { data, error } = await supabase.from('blog_posts').insert([dbData]).select().single();
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/admin/blogs');
  revalidatePath('/blog');
  return { success: true, data };
}

export async function updateBlogPost(id: string, formData: any) {
  const supabase = await createClient();
  const dbData: any = {
    title: formData.title,
    content: formData.content,
    featured_image: formData.imageUrl,
    published: formData.published,
  };
  if (formData.slug) dbData.slug = formData.slug;

  const { error } = await supabase.from('blog_posts').update(dbData).eq('id', id);
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/admin/blogs');
  revalidatePath(`/blog/${formData.slug || id}`);
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/admin/blogs');
  return { success: true };
}
