
import type { Metadata } from 'next';
import { PropertyListings } from '@/components/sections/property-listings';

export const metadata: Metadata = {
  title: 'Properties for Sale and To Let in South Africa | NC Properties',
  description: 'Browse our exclusive listings of properties for sale and to rent. Find your next home, apartment, or villa in South Africa\'s most sought-after locations.',
  openGraph: {
    title: 'Properties for Sale and To Let in South Africa | NC Properties',
    description: 'Browse our exclusive listings of properties for sale and to rent. Find your next home, apartment, or villa in South Africa\'s most sought-after locations.',
    type: 'website',
    url: '/properties',
  },
};

export default function PropertiesPage() {
  const pageDetails = {
    title: "All Properties",
    description: "Find your next home from our curated listings across South Africa."
  }
  return (
    <PropertyListings pageDetails={pageDetails} />
  );
}
