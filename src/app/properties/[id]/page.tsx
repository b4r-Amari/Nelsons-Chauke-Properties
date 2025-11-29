
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { BedDouble, Bath, Home, LandPlot, MapPin, CheckCircle, Video, Map, Camera, Share2, Building, Calendar, Hash } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { HomeLoanCalculator } from '@/components/shared/calculators/home-loan-calculator';
import { Card, CardContent } from '@/components/ui/card';
import { FloatingContactBar } from '@/components/shared/floating-contact-bar';

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
  
  const formatSimpleCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  };

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

  const listingDate = new Date();
  listingDate.setDate(listingDate.getDate() - (property.id % 30)); // Mock date based on ID

  const propertyDetails = [
      { label: "Listing Number", value: `T${property.id * 12345}`, icon: Hash },
      { label: "Property Type", value: property.type, icon: Building },
      { label: "Listing Date", value: listingDate.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' }), icon: Calendar },
      { label: "Floor Size", value: `${property.sqft} m²`, icon: Home },
      { label: "Rates & Taxes", value: formatSimpleCurrency((property.price / 1000) * 0.5), icon: null },
      { label: "Levies", value: formatSimpleCurrency((property.type === 'House' ? 0 : property.sqft * 15)), icon: null },
      { label: "Pet Friendly", value: property.features.some(f => f.toLowerCase().includes('pet friendly')) ? 'Yes' : 'No', icon: null },
      { label: "Security", value: property.features.some(f => f.toLowerCase().includes('secure estate')) ? 'Yes' : 'No', icon: null },
  ];

  return (
    <div className="bg-white">
       <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateListingSchema) }}
        />
        <div className="container py-4">
          <BackButton>Back to listings</BackButton>
        </div>
        
        <PropertyImageGallery images={galleryImages} mainImageHint={property.imageHint} isOnShow={property.onShow} />

        <div className="container mx-auto px-4">
           <div className="flex justify-start items-center bg-card text-center border-y my-2 p-2">
            <Button variant="ghost" className="flex items-center gap-1 text-muted-foreground"><Camera className="h-5 w-5" />Photos</Button>
            <Button variant="ghost" className="flex items-center gap-1 text-muted-foreground"><Map className="h-5 w-5" />Map</Button>
            <Button variant="ghost" className="flex items-center gap-1 text-muted-foreground"><Video className="h-5 w-5" />Video</Button>
             <div className="ml-auto">
              <Button variant="ghost" className="flex items-center gap-1 text-muted-foreground"><Share2 className="h-5 w-5" />Share</Button>
            </div>
          </div>
        </div>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
            <main>
                <div>
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

                        <Separator className="my-8" />

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold font-headline mb-4 text-brand-deep">Home Loan Calculator</h2>
                            <Card className="shadow-none border">
                                <CardContent className="p-4 sm:p-6">
                                     <HomeLoanCalculator purchasePrice={property.price} />
                                </CardContent>
                            </Card>
                        </section>
                     </article>
                </div>
            </main>
        </div>
      </div>
      <div className="container pb-12">
        <div className="max-w-4xl mx-auto space-y-12">
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
                 <section className="hidden md:block">
                    <EnquiryForm propertyId={params.id} />
                </section>
            </div>
        </div>
      </div>
      {propertyAgents.length > 0 && <FloatingContactBar agent={propertyAgents[0]} />}
    </div>
  );
}
