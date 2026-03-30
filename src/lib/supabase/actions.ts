
'use server';

import { createClient } from './server';
import { revalidatePath } from 'next/cache';

export async function addProperty(formData: any) {
  const supabase = await createClient();
  
  // Map camelCase to snake_case for the database
  const dbData = {
    agent_id: formData.agentId,
    title: formData.title,
    description: formData.description,
    price: formData.price,
    status: formData.status,
    type: formData.type,
    bedrooms: formData.bedrooms,
    bathrooms: formData.bathrooms,
    location: formData.location,
    sqft: formData.sqft,
    erf_size: formData.erfSize,
    year_built: formData.yearBuilt,
    features: formData.features,
    image_urls: formData.imageUrls,
    is_favorite: formData.isFavorite,
    on_show: formData.onShow,
    video_url: formData.videoUrl,
    published: formData.published ?? true
  };

  const { data, error } = await supabase.from('properties').insert([dbData]).select();
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/admin/properties');
  revalidatePath('/properties');
  return { success: true, data };
}

export async function updateProperty(id: string, formData: any) {
  const supabase = await createClient();
  
  const dbData: any = {};
  if (formData.agentId !== undefined) dbData.agent_id = formData.agentId;
  if (formData.title !== undefined) dbData.title = formData.title;
  if (formData.description !== undefined) dbData.description = formData.description;
  if (formData.price !== undefined) dbData.price = formData.price;
  if (formData.status !== undefined) dbData.status = formData.status;
  if (formData.type !== undefined) dbData.type = formData.type;
  if (formData.bedrooms !== undefined) dbData.bedrooms = formData.bedrooms;
  if (formData.bathrooms !== undefined) dbData.bathrooms = formData.bathrooms;
  if (formData.location !== undefined) dbData.location = formData.location;
  if (formData.sqft !== undefined) dbData.sqft = formData.sqft;
  if (formData.erfSize !== undefined) dbData.erf_size = formData.erfSize;
  if (formData.yearBuilt !== undefined) dbData.year_built = formData.yearBuilt;
  if (formData.features !== undefined) dbData.features = formData.features;
  if (formData.imageUrls !== undefined) dbData.image_urls = formData.imageUrls;
  if (formData.isFavorite !== undefined) dbData.is_favorite = formData.isFavorite;
  if (formData.onShow !== undefined) dbData.on_show = formData.onShow;
  if (formData.videoUrl !== undefined) dbData.video_url = formData.videoUrl;

  const { data, error } = await supabase.from('properties').update(dbData).eq('id', id).select();
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/admin/properties');
  revalidatePath(`/properties/${id}`);
  return { success: true, data };
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
    slug: formData.slug,
    email: formData.email,
    phone: formData.phone,
    photo_url: formData.photoUrl,
    bio: formData.bio,
    is_active: formData.isActive ?? true
  };

  const { data, error } = await supabase.from('estate_agents').insert([dbData]).select();
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/admin/agents');
  revalidatePath('/about-us');
  return { success: true, data };
}

export async function addMarketingLead(lead: { email: string; name?: string; source: string }) {
  const supabase = await createClient();
  
  // Fetch existing lead to append source
  const { data: existing } = await supabase
    .from('marketing_leads')
    .select('*')
    .eq('email', lead.email)
    .single();

  const sources = existing ? Array.from(new Set([...existing.sources, lead.source])) : [lead.source];

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
    name: request.name,
    email: request.email,
    phone: request.phone,
    property_details: request.propertyDetails
  };

  const { error } = await supabase.from('valuation_requests').insert([dbData]);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
