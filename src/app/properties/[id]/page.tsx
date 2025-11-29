
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { BedDouble, Bath, Home, LandPlot, MapPin, CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { getProperty, getProperties } from '@/lib/data';
import { type Property } from '@/components/shared/property-card';
import { AgentCard } from '@/components/shared/agent-card';
import { EnquiryForm } from '@/components/shared/enquiry-form';
import { PropertyImageGallery } from '@/components/shared/property-image-gallery';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getAgents } from '@/lib/data';
import { BackButton } from '@/components/shared/back-button';
import placeholders from '@/lib/placeholder-images.json';
import { Card, CardContent } from '@/components/ui/card';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const property = await getProperty(params.id);

  if (!property) {
    return {
      title: 'Property Not Found',
      description: 'The requested property could not be found.',
    };
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const title = `${property.beds} Bed ${property.type} for Sale in ${property.location} | NC Properties`;
  const description = `View details for ${property.address}. A ${property.beds} bedroom, ${property.baths} bathroom ${property.type} listed for ${formatPrice(property.price)}. ${property.description.substring(0, 120)}...`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/properties/${property.id}`,
      images: [
        {
          url: property.imageUrl,
          width: 300,
          height: 200,
          alt: `Exterior view of ${property.address}`,
        },
      ],
    }
  };
}

// This function tells Next.js which dynamic pages to pre-render at build time.
export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((property) => ({
    id: property.id.toString(),
  }));
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id);

  if (!property) {
    notFound();
  }
  
  const allAgents = await getAgents();
  const propertyAgents = allAgents.filter(a => property.agentIds.includes(a.id));

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

  const galleryImages = [
    property.imageUrl,
    placeholders.propertyGallery.url.replace('gallery', 'gallery1'),
    placeholders.propertyGallery.url.replace('gallery', 'gallery2'),
    placeholders.propertyGallery.url.replace('gallery', 'gallery3'),
  ];

  const realEstateListingSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.address,
    "description": property.description,
    "image": property.imageUrl,
    "url": `https://nelson-chauke-prop.web.app/properties/${property.id}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": property.location.split(',')[0],
      "addressRegion": property.location.split(',')[1],
      "addressCountry": "ZA"
    },
    "numberOfBedrooms": property.beds,
    "numberOfBathroomsTotal": property.baths,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.sqft,
      "unitCode": "MTK"
    },
    ...(property.status === 'for-sale' && {
      "offers": {
        "@type": "Offer",
        "price": property.price,
        "priceCurrency": "ZAR",
        "availability": "https://schema.org/InStock"
      }
    }),
    ...(property.status === 'to-let' && {
      "leaseLength": {
        "@type": "QuantitativeValue",
        "value": 12,
        "unitText": "MONTH"
      },
      "offers": {
        "@type": "Offer",
        "price": property.price,
        "priceCurrency": "ZAR",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": property.price,
          "priceCurrency": "ZAR",
          "unitText": "monthly"
        }
      }
    })
  };

  return (
    <div className="bg-background">
       <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateListingSchema) }}
        />
        <header className="relative h-[300px] md:h-[500px]">
             <Image
                src={property.imageUrl}
                alt={`Main image of the property, showing the ${property.imageHint}.`}
                data-ai-hint={property.imageHint}
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 left-4 z-10">
                <BackButton>Back to Listings</BackButton>
            </div>
        </header>

      <div className="container py-8 -mt-20 z-10 relative">
        <div className="max-w-4xl mx-auto">
            <main>
                <Card className="shadow-2xl">
                    <CardContent className="p-6 md:p-8">
                         <header className="mb-6 border-b pb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold font-headline text-brand-deep">{property.address}</h1>
                                    <p className="text-md md:text-lg text-muted-foreground mt-1 flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-brand-bright" />
                                        {property.location}
                                    </p>
                                </div>
                                <div className="text-left sm:text-right flex-shrink-0">
                                    <p className="text-3xl font-bold text-brand-bright">{formatPrice(property.price)}</p>
                                    <div className="flex gap-2 mt-2 justify-start sm:justify-end">
                                        {property.onShow && <Badge className="bg-brand-bright text-white border-none">On Show</Badge>}
                                        {property.status === 'sold' && <Badge variant="destructive">SOLD</Badge>}
                                    </div>
                                </div>
                            </div>
                        </header>
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border rounded-lg p-4 md:p-6 bg-muted/50 mb-8">
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
                                <h2 className="text-2xl font-bold font-headline mb-4 text-brand-deep">Features</h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                {property.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                    <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                                </ul>
                            </section>
                         </article>
                    </CardContent>
                </Card>
            </main>
        </div>
      </div>
      <div className="container pb-12">
        <div className="max-w-4xl mx-auto space-y-12">
             <section>
                <h2 className="text-2xl font-bold font-headline mb-6 text-brand-deep text-center">Image Gallery</h2>
                <PropertyImageGallery images={galleryImages} mainImageHint={property.imageHint} />
            </section>
            
            <Separator />
            
            <div className="grid md:grid-cols-2 gap-12">
                <section>
                    <h2 className="text-2xl font-bold font-headline mb-6 text-brand-deep">Contact Agent</h2>
                    <div className="space-y-8">
                    {propertyAgents.map(agent => (
                        <AgentCard key={agent.id} agent={agent} />
                    ))}
                    </div>
                </section>
                 <section>
                    <EnquiryForm propertyId={params.id} />
                </section>
            </div>
        </div>
      </div>
    </div>
  );
}

