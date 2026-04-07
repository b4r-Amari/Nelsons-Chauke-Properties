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
  const propertyAgents = allAgents.filter(a => String(a.id) === String(property.agentId));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `https://nc-properties.vercel.app/properties/${property.id}`,
    "image": property.imageUrls,
    "datePosted": property.createdAt,
    "itemOffered": {
      "@type": property.type === 'Apartment' ? 'Apartment' : 'House',
      "name": property.title,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": property.address || property.title,
        "addressLocality": property.location.split(',')[0].trim(),
        "addressRegion": "Gauteng",
        "addressCountry": "ZA"
      },
      "numberOfBedrooms": property.bedrooms,
      "numberOfBathroomsTotal": property.bathrooms,
      "floorSize": {
        "@type": "QuantitativeValue",
        "value": property.floorSize,
        "unitCode": "MTK"
      }
    },
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "ZAR",
      "availability": property.status === 'sold' ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      "url": `https://nc-properties.vercel.app/properties/${property.id}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropertyDetailClient property={property} agents={propertyAgents} />
    </>
  );
}
