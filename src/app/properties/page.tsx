
"use client"

import { useState } from "react";
import { PropertyCard, type Property } from "@/components/shared/property-card";
import { PropertyFilter } from "@/components/shared/property-filter";
import propertiesData from '@/data/properties.json';

const allProperties: Property[] = (propertiesData as Property[]).filter(p => p.status !== 'sold');

export default function PropertiesPage() {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(allProperties);

  return (
    <>
      <section className="bg-brand-deep text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold font-headline">Properties for Sale</h1>
          <p className="text-lg mt-2 text-white/80">Find your next home from our curated listings across South Africa.</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <PropertyFilter 
                properties={allProperties} 
                onFilterChange={setFilteredProperties}
              />
            </aside>
            <main className="lg:col-span-3">
                {filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProperties.map((prop) => (
                            <PropertyCard key={prop.id} property={prop} />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full bg-card rounded-lg shadow-md p-12">
                        <p className="text-xl text-muted-foreground text-center">No properties match your current filters. Try adjusting your search criteria.</p>
                    </div>
                )}
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
