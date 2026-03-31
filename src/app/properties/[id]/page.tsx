
import { notFound } from 'next/navigation';
import { getProperty, getAgents } from '@/lib/data';
import { type Property } from '@/lib/types';
import { type Agent } from '@/lib/types';
import { PropertyDetailClient } from '@/components/property/property-detail-client';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) return { title: 'Property Not Found' };
  
  return {
    title: `${property.title} - ${property.location}`,
    description: property.description,
    openGraph: {
      title: property.title,
      description: property.description,
      images: property.imageUrls
    }
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const property = await getProperty(id);
  
  if (!property) {
    notFound();
  }
  
  const allAgents = await getAgents();
  // Fixed: Filter using the single agentId field from the Supabase schema
  const propertyAgents = allAgents.filter(a => String(a.id) === String(property.agentId));

  return (
    <PropertyDetailClient property={property} agents={propertyAgents} />
  );
}
