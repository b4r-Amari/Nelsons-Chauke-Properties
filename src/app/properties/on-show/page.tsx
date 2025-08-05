
"use client"

import { useState } from "react";
import { PropertyCard, type Property } from "@/components/shared/property-card";
import { PropertyFilter } from "@/components/shared/property-filter";
import propertiesData from '@/data/properties.json';

const onShowProperties: Property[] = propertiesData.filter(p => p.onShow && p.status !== 'sold');

export default function OnShowPropertiesPage() {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(onShowProperties);

  return (
    <>
      <section className="bg-brand-deep text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold font-headline">Properties On Show</h1>
          <p className="text-lg mt-2 text-white/80">Visit these properties this weekend. Find your dream home.</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <PropertyFilter 
                properties={onShowProperties} 
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
                  <p className="text-xl text-muted-foreground text-center">No properties on show match your current filters. Try adjusting your search criteria.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
