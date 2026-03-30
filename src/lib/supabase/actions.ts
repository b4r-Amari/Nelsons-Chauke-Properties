'use server';

import { createClient } from './server';
import { revalidatePath } from 'next/cache';

export async function addProperty(formData: any) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('properties').insert([formData]).select();
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/properties');
  return { success: true, data };
}

export async function updateProperty(id: string, formData: any) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('properties').update(formData).eq('id', id).select();
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

export async function addMarketingLead(lead: { email: string; name?: string; source: string }) {
  const supabase = await createClient();
  // In Supabase, we can upsert or check for existing user in the public.users table
  const { error } = await supabase.from('users').upsert({
    email: lead.email,
    display_name: lead.name,
    signup_sources: [lead.source]
  }, { onConflict: 'email' });
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function addValuationRequest(request: any) {
  const supabase = await createClient();
  const { error } = await supabase.from('valuation_requests').insert([request]);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
