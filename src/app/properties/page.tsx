
import type { Metadata } from 'next';
import { PropertyListings } from '@/components/sections/property-listings';
import { getProperties } from '@/lib/data';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Properties for Sale and To Let | South Africa Real Estate',
  description: 'Browse our exclusive listings of properties for sale and to rent. Find your next home, apartment, or luxury villa in South Africa\'s most sought-after locations.',
  alternates: {
    canonical: '/properties',
  },
  openGraph: {
    title: 'Properties for Sale and To Let in South Africa | NC Properties',
    description: 'Explore curated real estate listings. Find your next home, apartment, or investment property with NC Properties.',
    type: 'website',
    url: '/properties',
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
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-[480px] w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default async function PropertiesPage() {
  const properties = await getProperties();
  const pageDetails = {
    title: "All Properties",
    description: "Find your next home from our curated listings across South Africa."
  }
  return (
    <Suspense fallback={<ListingsSkeleton />}>
        <PropertyListings pageDetails={pageDetails} initialProperties={properties} />
    </Suspense>
  );
}
