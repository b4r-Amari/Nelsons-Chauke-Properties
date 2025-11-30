
"use client";

import { PropertyCard, type Property } from "@/components/shared/property-card";
import { getProperties } from "@/lib/data";
import { useState, useEffect } from "react";

export default function SoldPropertiesPage() {
  const [soldProperties, setSoldProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchSold = async () => {
      const props = await getProperties({ status: 'sold' });
      setSoldProperties(props);
    };
    fetchSold();
  }, []);

  return (
    <>
      <section className="bg-brand-deep text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold font-headline">Sold Properties</h1>
          <p className="text-lg mt-2 text-white/80">A showcase of our successfully sold properties.</p>
        </div>
      </section>

      <main className="py-16 bg-background">
        <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {soldProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
        </div>
      </main>
    </>
  );
}
