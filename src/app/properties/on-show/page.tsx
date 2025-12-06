

import type { Metadata } from 'next';
import { PropertyListings } from '@/components/sections/property-listings';
import { getProperties } from '@/lib/data';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


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

function ListingsSkeleton() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[480px] w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default async function OnShowPropertiesPage() {
  const propertiesOnShow = await getProperties({ onShow: true });
  const pageDetails = {
    title: "Properties On Show",
    description: "Visit these properties this weekend. Find your dream home."
  }
  return (
    <Suspense fallback={<ListingsSkeleton />}>
      <PropertyListings pageDetails={pageDetails} initialProperties={propertiesOnShow} />
    </Suspense>
  );
}

    
