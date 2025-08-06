
import type { Metadata } from 'next';
import { PropertyListings } from '@/components/sections/property-listings';

export const metadata: Metadata = {
  title: 'Properties to Let in South Africa | NC Properties',
  description: 'Find your perfect rental property. Browse our listings of homes, apartments, and townhouses to rent across South Africa.',
  openGraph: {
    title: 'Properties to Let in South Africa | NC Properties',
    description: 'Find your perfect rental property. Browse our listings of homes, apartments, and townhouses to rent across South Africa.',
    type: 'website',
    url: '/properties/to-let',
  },
};

export default function ToLetPropertiesPage() {
  return (
    <>
      <section className="bg-brand-deep text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold font-headline">Properties to Let</h1>
          <p className="text-lg mt-2 text-white/80">Find your next rental home from our curated listings.</p>
        </div>
      </section>
      <PropertyListings status="to-let" />
    </>
  );
}
