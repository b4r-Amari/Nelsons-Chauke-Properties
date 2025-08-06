
import type { Metadata } from 'next';
import { PropertyListings } from '@/components/sections/property-listings';

export const metadata: Metadata = {
  title: 'Properties for Sale in South Africa | NC Properties',
  description: 'Browse our exclusive listings of properties for sale. Find your next home, apartment, or villa in South Africa\'s most sought-after locations.',
  openGraph: {
    title: 'Properties for Sale in South Africa | NC Properties',
    description: 'Browse our exclusive listings of properties for sale. Find your next home, apartment, or villa in South Africa\'s most sought-after locations.',
    type: 'website',
    url: '/properties',
  },
};

export default function PropertiesPage() {
  return (
    <>
      <section className="bg-brand-deep text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold font-headline">Properties for Sale</h1>
          <p className="text-lg mt-2 text-white/80">Find your next home from our curated listings across South Africa.</p>
        </div>
      </section>
      <PropertyListings status="for-sale" />
    </>
  );
}
