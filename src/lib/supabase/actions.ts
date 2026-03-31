
'use server';

import { createClient } from './server';
import { revalidatePath } from 'next/cache';

export async function addProperty(formData: any) {
  const supabase = await createClient();
  
  const propertyData = {
    agent_id: formData.agentId || null,
    title: formData.address || formData.title,
    description: formData.description,
    price: Number(formData.price),
    status: formData.status,
    type: formData.type,
    bedrooms: Number(formData.beds || formData.bedrooms),
    bathrooms: Number(formData.baths || formData.bathrooms),
    location: formData.location,
    features: formData.features,
    image_urls: formData.imageUrls
  };

  const { data, error } = await supabase.from('properties').insert([propertyData]).select().single();

  if (error) return { success: false, error: error.message };
  
  revalidatePath('/admin/properties');
  revalidatePath('/properties');
  return { success: true, data };
}

export async function updateProperty(id: string, formData: any) {
  const supabase = await createClient();
  
  const dbData: any = {};
  if (formData.address !== undefined || formData.title !== undefined) dbData.title = formData.address || formData.title;
  if (formData.location !== undefined) dbData.location = formData.location;
  if (formData.price !== undefined) dbData.price = Number(formData.price);
  if (formData.status !== undefined) dbData.status = formData.status;
  if (formData.type !== undefined) dbData.type = formData.type;
  if (formData.beds !== undefined || formData.bedrooms !== undefined) dbData.bedrooms = Number(formData.beds || formData.bedrooms);
  if (formData.baths !== undefined || formData.bathrooms !== undefined) dbData.bathrooms = Number(formData.baths || formData.bathrooms);
  if (formData.description !== undefined) dbData.description = formData.description;
  if (formData.features !== undefined) dbData.features = formData.features;
  if (formData.imageUrls !== undefined || formData.image_urls !== undefined) dbData.image_urls = formData.imageUrls || formData.image_urls;
  if (formData.agentId !== undefined) dbData.agent_id = formData.agentId || null;

  const { error } = await supabase.from('properties').update(dbData).eq('id', id);
  if (error) return { success: false, error: error.message };

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
    photo_url: formData.photoUrl || formData.imageUrl
  };

  const { data, error } = await supabase.from('estate_agents').insert([dbData]).select();
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/admin/agents');
  revalidatePath('/about-us');
  return { success: true, data };
}

export async function updateAgent(id: string, formData: any) {
  const supabase = await createClient();
  const dbData: any = {
    first_name: formData.firstName || formData.name?.split(' ')[0],
    last_name: formData.lastName || formData.name?.split(' ').slice(1).join(' '),
    email: formData.email,
    phone: formData.phone,
    photo_url: formData.photoUrl || formData.imageUrl
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
    property_details: request.propertyAddress || request.address || request.property_details
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
    excerpt: formData.excerpt,
    category: formData.category,
    author: formData.author,
    featured_image: formData.imageUrl || formData.featured_image,
    published: formData.published ?? true
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
    excerpt: formData.excerpt,
    category: formData.category,
    author: formData.author,
    featured_image: formData.imageUrl || formData.featured_image,
    published: formData.published
  };
  if (formData.slug) dbData.slug = formData.slug;

  const { error } = await supabase.from('blog_posts').update(dbData).eq('id', id);
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/admin/blogs');
  revalidatePath(`/blog/${formData.slug}`);
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/admin/blogs');
  return { success: true };
}
