

import type { Metadata } from 'next';
import { PropertyListings } from '@/components/sections/property-listings';
import { getProperties } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Properties On Show This Weekend | NC Properties',
  description: 'Find all properties on show this weekend. Visit your dream home with NC Properties and explore our exclusive listings open for viewing.',
  openGraph: {
    title: 'Properties On Show This Weekend | NC Properties',
    description: 'Find all properties on show this weekend. Visit your dream home with NC Properties and explore our exclusive listings open for viewing.',
    type: 'website',
    url: '/properties/on-show',
  },
};

export default async function OnShowPropertiesPage() {
  const propertiesOnShow = await getProperties({ status: 'on-show' });
  const pageDetails = {
    title: "Properties On Show",
    description: "Visit these properties this weekend. Find your dream home."
  }
  return (
    <PropertyListings pageDetails={pageDetails} initialProperties={propertiesOnShow} />
  );
}

    