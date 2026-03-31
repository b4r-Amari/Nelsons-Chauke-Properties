
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { BedDouble, Bath, Home, LandPlot, MapPin, CheckCircle, Video, Camera, Share2, Building, Calendar, Hash, Link as LinkIcon, Copy, Facebook, Twitter } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Link from 'next/link';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413 0 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.456l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.447-4.435-9.884-9.888-9.884-5.448 0-9.886 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413z" /></svg>
);

export function PropertyDetailClient({ property, agents }: { property: Property, agents: Agent[] }) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { toast } = useToast();

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
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link Copied", description: "Property link copied to clipboard." });
    } catch (e) {
      toast({ variant: "destructive", title: "Could not copy link" });
    }
  };

  const galleryImages = property.imageUrls.length > 0 ? property.imageUrls : [placeholders.propertyDefault.url];

  const propertyDetails = [
      { label: "Property Type", value: property.type, icon: Building },
      { label: "Floor Size", value: `${property.sqft} m²`, icon: Home },
      { label: "Rates & Taxes", value: formatSimpleCurrency((property.price / 1000) * 0.5), icon: null },
      { label: "Pet Friendly", value: property.features.some(f => f.toLowerCase().includes('pet friendly')) ? 'Yes' : 'No', icon: null },
  ];

  return (
    <div className="bg-white">
        <div className="container py-4">
          <BackButton>Back to listings</BackButton>
        </div>
        
        <PropertyImageGallery 
            images={galleryImages} 
            mainImageHint={property.title} 
            isOnShow={property.onShow}
            isOpen={isGalleryOpen}
            onOpenChange={setIsGalleryOpen}
        />

        <div className="flex justify-around items-center bg-card text-center border-y p-2 md:hidden">
          <Button variant="ghost" className="flex flex-col h-auto items-center gap-1 text-muted-foreground" onClick={() => setIsGalleryOpen(true)}>
            <Camera className="h-5 w-5" />Photos
          </Button>
          {property.videoUrl && (
            <Button asChild variant="ghost" className="flex flex-col h-auto items-center gap-1 text-muted-foreground">
              <a href={property.videoUrl} target="_blank" rel="noopener noreferrer">
                <Video className="h-5 w-5" />Video
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
                            <span className="font-semibold text-md md:text-lg">{property.beds}</span>
                            <span className="text-xs md:text-sm text-muted-foreground">Bedrooms</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 md:gap-2">
                            <Bath className="h-7 w-7 md:h-8 md:w-8 text-brand-bright"/>
                            <span className="font-semibold text-md md:text-lg">{property.baths}</span>
                            <span className="text-xs md:text-sm text-muted-foreground">Bathrooms</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 md:gap-2">
                            <Home className="h-7 w-7 md:h-8 md:w-8 text-brand-bright"/>
                            <span className="font-semibold text-md md:text-lg">{property.sqft} m²</span>
                            <span className="text-xs md:text-sm text-muted-foreground">House Size</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 md:gap-2">
                            <LandPlot className="h-7 w-7 md:h-8 md:w-8 text-brand-bright"/>
                            <span className="font-semibold text-md md:text-lg">{property.erfSize} m²</span>
                            <span className="text-xs md:text-sm text-muted-foreground">Erf Size</span>
                        </div>
                    </div>

                     <article>
                         <section className="mb-8">
                            <h2 className="text-2xl font-bold font-headline mb-4 text-brand-deep">Property Description</h2>
                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <p>{property.description}</p>
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
