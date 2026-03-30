
'use server';

import { createClient } from './server';
import { revalidatePath } from 'next/cache';

export async function addProperty(formData: any) {
  const supabase = await createClient();
  
  // 1. Insert property main data
  const propertyData = {
    address: formData.address,
    slug: formData.slug,
    location: formData.location,
    price: formData.price,
    status: formData.status,
    type: formData.type,
    beds: formData.beds,
    baths: formData.baths,
    sqft: formData.sqft,
    erf_size: formData.erfSize,
    year_built: formData.yearBuilt,
    description: formData.description,
    features: formData.features,
    image_urls: formData.imageUrls,
    is_favorite: formData.isFavorite,
    on_show: formData.onShow,
    video_url: formData.videoUrl
  };

  const { data: prop, error: propError } = await supabase
    .from('properties')
    .insert([propertyData])
    .select()
    .single();

  if (propError) return { success: false, error: propError.message };

  // 2. Insert Agent Assignments into property_agents join table
  if (formData.agentIds && formData.agentIds.length > 0) {
    const assignments = formData.agentIds.map((agentId: string) => ({
      property_id: prop.id,
      agent_id: agentId
    }));
    const { error: joinError } = await supabase.from('property_agents').insert(assignments);
    if (joinError) console.error('Error assigning agents:', joinError.message);
  }
  
  revalidatePath('/admin/properties');
  revalidatePath('/properties');
  return { success: true, data: prop };
}

export async function updateProperty(id: string, formData: any) {
  const supabase = await createClient();
  
  const dbData: any = {};
  if (formData.address !== undefined) dbData.address = formData.address;
  if (formData.slug !== undefined) dbData.slug = formData.slug;
  if (formData.location !== undefined) dbData.location = formData.location;
  if (formData.price !== undefined) dbData.price = formData.price;
  if (formData.status !== undefined) dbData.status = formData.status;
  if (formData.type !== undefined) dbData.type = formData.type;
  if (formData.beds !== undefined) dbData.beds = formData.beds;
  if (formData.baths !== undefined) dbData.baths = formData.baths;
  if (formData.sqft !== undefined) dbData.sqft = formData.sqft;
  if (formData.erfSize !== undefined) dbData.erf_size = formData.erfSize;
  if (formData.yearBuilt !== undefined) dbData.year_built = formData.yearBuilt;
  if (formData.description !== undefined) dbData.description = formData.description;
  if (formData.features !== undefined) dbData.features = formData.features;
  if (formData.imageUrls !== undefined) dbData.image_urls = formData.imageUrls;
  if (formData.isFavorite !== undefined) dbData.is_favorite = formData.isFavorite;
  if (formData.onShow !== undefined) dbData.on_show = formData.onShow;
  if (formData.videoUrl !== undefined) dbData.video_url = formData.videoUrl;

  const { error: updateError } = await supabase.from('properties').update(dbData).eq('id', id);
  if (updateError) return { success: false, error: updateError.message };

  // Update Agent Assignments (Clear and Re-insert)
  if (formData.agentIds) {
    await supabase.from('property_agents').delete().eq('property_id', id);
    if (formData.agentIds.length > 0) {
      const assignments = formData.agentIds.map((agentId: string) => ({
        property_id: id,
        agent_id: agentId
      }));
      await supabase.from('property_agents').insert(assignments);
    }
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
    name: formData.name || `${formData.firstName} ${formData.lastName}`,
    slug: formData.slug,
    role: formData.role,
    email: formData.email,
    phone: formData.phone,
    image_url: formData.photoUrl || formData.imageUrl,
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
    .from('users')
    .select('signup_sources')
    .eq('email', lead.email)
    .single();

  const sources = existing ? Array.from(new Set([...(existing.signup_sources || []), lead.source])) : [lead.source];

  const { error } = await supabase.from('users').upsert({
    email: lead.email,
    display_name: lead.name,
    signup_sources: sources
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
    address: request.propertyAddress || request.address
  };

  const { error } = await supabase.from('valuation_requests').insert([dbData]);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
