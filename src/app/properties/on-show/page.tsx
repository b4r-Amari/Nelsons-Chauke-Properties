
import { PropertyCard, type Property } from "@/components/shared/property-card";
import propertiesData from '@/data/properties.json';
import { Badge } from "@/components/ui/badge";

const onShowProperties: Property[] = propertiesData.filter(p => p.onShow);

export default function OnShowPropertiesPage() {
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
          {onShowProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {onShowProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">There are currently no properties on show. Please check back later.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
