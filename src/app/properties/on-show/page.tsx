
import type { Metadata } from 'next';
import { PropertyListings } from '@/components/sections/property-listings';

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

export default function OnShowPropertiesPage() {
  return (
    <>
      <section className="bg-brand-deep text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold font-headline">Properties On Show</h1>
          <p className="text-lg mt-2 text-white/80">Visit these properties this weekend. Find your dream home.</p>
        </div>
      </section>
      <PropertyListings status="on-show" />
    </>
  );
}
