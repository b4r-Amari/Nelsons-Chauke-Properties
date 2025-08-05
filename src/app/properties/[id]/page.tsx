
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { BedDouble, Bath, Home, LandPlot, Building, User, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

import propertiesData from '@/data/properties.json';
import { type Property } from '@/components/shared/property-card';
import { AgentCard } from '@/components/shared/agent-card';
import { EnquiryForm } from '@/components/shared/enquiry-form';
import { PropertyImageGallery } from '@/components/shared/property-image-gallery';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import agentsData from '@/data/agents.json';

const properties: Property[] = propertiesData;

// This function tells Next.js which dynamic pages to pre-render at build time.
export async function generateStaticParams() {
  return properties.map((property) => ({
    id: property.id.toString(),
  }));
}

function getProperty(id: string) {
  return properties.find((p) => p.id.toString() === id);
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = getProperty(params.id);

  if (!property) {
    notFound();
  }
  
  // In a real app, properties would have an agentId. For now, we'll assign one.
  const agent = agentsData.find(a => a.id === property.agentId)!;

  const formatPrice = (price: number) => {
    const isRental = property.status === 'to-let';
    const formattedPrice = new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    return isRental ? `${formattedPrice} /month` : formattedPrice;
  }

  // Dummy gallery images. In a real app, these would be specific to the property.
  const galleryImages = [
    property.imageUrl,
    "https://placehold.co/1200x800",
    "https://placehold.co/1200x800",
    "https://placehold.co/1200x800",
  ];

  return (
    <div className="bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column: Gallery and Details */}
          <div className="lg:col-span-2">
            <PropertyImageGallery images={galleryImages} mainImageHint={property.imageHint} />
            
            <div className="mt-8">
              <header className="mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold font-headline text-brand-deep">{property.address}</h1>
                        <p className="text-lg text-muted-foreground mt-1 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-brand-bright" />
                            {property.location}
                        </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-3xl font-bold text-brand-bright">{formatPrice(property.price)}</p>
                        {property.onShow && <Badge className="mt-2 bg-brand-bright text-white border-none">On Show</Badge>}
                        {property.status === 'sold' && <Badge variant="destructive" className="mt-2">SOLD</Badge>}
                    </div>
                </div>
              </header>

              <Separator className="my-8" />
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center border rounded-lg p-6 bg-card">
                 <div className="flex flex-col items-center gap-2">
                    <BedDouble className="h-8 w-8 text-brand-bright"/>
                    <span className="font-semibold text-lg">{property.beds}</span>
                    <span className="text-sm text-muted-foreground">Bedrooms</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Bath className="h-8 w-8 text-brand-bright"/>
                    <span className="font-semibold text-lg">{property.baths}</span>
                    <span className="text-sm text-muted-foreground">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Home className="h-8 w-8 text-brand-bright"/>
                    <span className="font-semibold text-lg">{property.sqft} m²</span>
                     <span className="text-sm text-muted-foreground">House Size</span>
                </div>
                 <div className="flex flex-col items-center gap-2">
                    <LandPlot className="h-8 w-8 text-brand-bright"/>
                    <span className="font-semibold text-lg">{property.erfSize} m²</span>
                    <span className="text-sm text-muted-foreground">Erf Size</span>
                </div>
              </div>

              <Separator className="my-8" />

              <div>
                <h2 className="text-2xl font-bold font-headline mb-4 text-brand-deep">Property Description</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p>{property.description}</p>
                </div>
              </div>
              
               <Separator className="my-8" />

              <div>
                <h2 className="text-2xl font-bold font-headline mb-4 text-brand-deep">Features</h2>
                 <ul className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {property.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
          
          {/* Right Column: Enquiry and Agent */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <EnquiryForm />
              {agent && <AgentCard agent={agent} />}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
