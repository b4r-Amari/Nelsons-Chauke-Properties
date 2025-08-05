
import { PropertyCard, type Property } from "@/components/shared/property-card";
import { PropertyFilter } from "@/components/shared/property-filter";
import propertiesData from '@/data/properties.json';

const allProperties: Property[] = propertiesData;

export default function PropertiesPage() {
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
              <PropertyFilter />
            </aside>
            <main className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allProperties.map((prop) => (
                        <PropertyCard key={prop.id} property={prop} />
                    ))}
                </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
