
"use client";

import { useState } from 'react';
import { BedDouble, Bath, Home, LandPlot, MapPin, Camera, Video, Building } from 'lucide-react';
import { type Property, type Agent } from '@/lib/types';
import { AgentCard } from '@/components/shared/agent-card';
import { EnquiryForm } from '@/components/shared/enquiry-form';
import { PropertyImageGallery } from '@/components/shared/property-image-gallery';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BackButton } from '@/components/shared/back-button';
import placeholders from '@/lib/placeholder-images.json';
import { Button } from '@/components/ui/button';
import { HomeLoanCalculator } from '@/components/shared/calculators/home-loan-calculator';
import { Card, CardContent } from '@/components/ui/card';
import { FloatingContactBar } from '@/components/shared/floating-contact-bar';

export function PropertyDetailClient({ property, agents }: { property: Property, agents: Agent[] }) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

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
  
  const formatSimpleCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', { 
      style: 'currency', 
      currency: 'ZAR', 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    }).format(value);
  };

  const galleryImages = Array.isArray(property.imageUrls) 
    ? property.imageUrls.filter(url => typeof url === 'string' && url.length > 0)
    : [];
    
  const finalGalleryImages = galleryImages.length > 0 ? galleryImages : [placeholders.propertyDefault.url];

  const features = Array.isArray(property.features) ? property.features : [];
  const isPetFriendly = features.some(f => typeof f === 'string' && f.toLowerCase().includes('pet friendly'));

  const propertyDetails = [
      { label: "Property Type", value: property.type, icon: Building },
      { label: "Floor Size", value: `${property.floorSize || 0} m²`, icon: Home },
      { label: "Rates & Taxes", value: formatSimpleCurrency((property.price / 1000) * 0.5), icon: null },
      { label: "Pet Friendly", value: isPetFriendly ? 'Yes' : 'No', icon: null },
  ];

  return (
    <div className="bg-white pb-20 md:pb-0">
        <div className="container py-4">
          <BackButton>Back to listings</BackButton>
        </div>
        
        <PropertyImageGallery 
            images={finalGalleryImages} 
            mainImageHint={property.title} 
            isOnShow={property.onShow}
            isOpen={isGalleryOpen}
            onOpenChange={setIsGalleryOpen}
        />

        <div className="flex justify-around items-center bg-card text-center border-y p-2 md:hidden">
          <Button variant="ghost" className="flex flex-col h-auto items-center gap-1 text-muted-foreground" onClick={() => setIsGalleryOpen(true)}>
            <Camera className="h-5 w-5" />
            <span className="text-xs">Photos</span>
          </Button>
          {property.videoUrl && (
            <Button asChild variant="ghost" className="flex flex-col h-auto items-center gap-1 text-muted-foreground">
              <a href={property.videoUrl} target="_blank" rel="noopener noreferrer">
                <Video className="h-5 w-5" />
                <span className="text-xs">Video</span>
              </a>
            </Button>
          )}
        </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <main className="lg:col-span-2">
                <div className="p-0 md:p-8">
                     <header className="mb-6 border-b pb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold font-headline text-brand-deep">{property.title}</h1>
                                <p className="text-md md:text-lg text-muted-foreground mt-1 flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-brand-bright" />
                                    {property.location}
                                </p>
                            </div>
                            <div className="text-left sm:text-right flex-shrink-0">
                                <p className="text-3xl font-bold text-brand-bright">{formatPrice(property.price)}</p>
                                {property.status === 'sold' && <Badge variant="destructive" className="mt-2">SOLD</Badge>}
                            </div>
                        </div>
                    </header>
                     <div className="grid grid-cols-4 gap-4 text-center border rounded-lg p-4 md:p-6 bg-muted/50 mb-8">
                        <div className="flex flex-col items-center gap-1 md:gap-2">
                            <BedDouble className="h-7 w-7 md:h-8 md:w-8 text-brand-bright"/>
                            <span className="font-semibold text-md md:text-lg">{property.bedrooms}</span>
                            <span className="text-xs md:text-sm text-muted-foreground">Bedrooms</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 md:gap-2">
                            <Bath className="h-7 w-7 md:h-8 md:w-8 text-brand-bright"/>
                            <span className="font-semibold text-md md:text-lg">{property.bathrooms}</span>
                            <span className="text-xs md:text-sm text-muted-foreground">Bathrooms</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 md:gap-2">
                            <Home className="h-7 w-7 md:h-8 md:w-8 text-brand-bright"/>
                            <span className="font-semibold text-md md:text-lg">{property.floorSize || 0} m²</span>
                            <span className="text-xs md:text-sm text-muted-foreground">House Size</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 md:gap-2">
                            <LandPlot className="h-7 w-7 md:h-8 md:w-8 text-brand-bright"/>
                            <span className="font-semibold text-md md:text-lg">{property.erfSize || 0} m²</span>
                            <span className="text-xs md:text-sm text-muted-foreground">Erf Size</span>
                        </div>
                    </div>

                     <article>
                         <section className="mb-8">
                            <h2 className="text-2xl font-bold font-headline mb-4 text-brand-deep">Property Description</h2>
                            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                                {property.description}
                            </div>
                        </section>
                        <Separator className="my-8" />
                         <section className="mb-8">
                            <h2 className="text-2xl font-bold font-headline mb-4 text-brand-deep">Property Details</h2>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                                {propertyDetails.map((detail) => (
                                    <div key={detail.label} className="flex items-center gap-3">
                                        {detail.icon && <detail.icon className="h-5 w-5 text-brand-bright flex-shrink-0" />}
                                        <div className="flex-grow">
                                            <p className="text-sm text-muted-foreground">{detail.label}</p>
                                            <p className="font-semibold">{detail.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        <Separator className="my-8" />
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold font-headline mb-4 text-brand-deep">Home Loan Calculator</h2>
                            <Card className="shadow-none border">
                                <CardContent className="p-4 sm:p-6">
                                     <HomeLoanCalculator purchasePrice={property.price} />
                                </CardContent>
                            </Card>
                        </section>
                         <Separator className="my-8" />
                        <section>
                            <h2 className="text-2xl font-bold font-headline mb-6 text-brand-deep">Contact Agent</h2>
                            <div className="space-y-8">
                            {agents.map(agent => (
                                <AgentCard key={agent.id} agent={agent} />
                            ))}
                            </div>
                        </section>
                     </article>
                </div>
            </main>
            <aside className="sticky top-24 h-fit hidden lg:block">
                <EnquiryForm propertyId={property.id} />
            </aside>
        </div>
      </div>
      {agents.length > 0 && <FloatingContactBar agent={agents[0]} />}
    </div>
  );
}
