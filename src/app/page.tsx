
"use client";

import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { PropertyCard } from '@/components/shared/property-card';
import type { Property } from '@/components/shared/property-card';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { HeroSection, CtaTabsSection, NewsletterSection } from '@/components/sections/home-page-sections';
import { getProperties } from '@/lib/data';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


function FeaturedPropertiesSection() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      const props = await getProperties({ featuredOnly: true });
      setFeaturedProperties(props);
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-background relative mt-32 md:mt-0">
        <div className="container">
          <h2 className="text-3xl font-bold text-center font-headline mb-4">Featured Properties</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Discover our curated selection of premier properties...</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-[250px] w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-background relative mt-32 md:mt-0">
      <div className="container">
        <h2 className="text-3xl font-bold text-center font-headline mb-4">Featured Properties</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Discover our curated selection of premier properties in South Africa, offering the perfect blend of luxury, comfort, and style.</p>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {featuredProperties.map((prop) => (
              <CarouselItem key={prop.id} className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1 h-full">
                  <PropertyCard property={prop} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="text-center mt-12">
          <Link href="/properties">
            <Button size="lg" className="bg-brand-bright hover:bg-brand-deep transition-colors">
              View All Properties <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ShortAboutSection() {
  return (
    <section className="py-24 bg-card">
      <div className="container">
        <article className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold font-headline text-brand-deep">Welcome to NC Properties</h2>
          <Separator className="w-24 h-1 bg-brand-bright mx-auto my-6" />
          <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-4">
            <p>At NC Properties, we pride ourselves on offering a personalised and professional real estate experience tailored to your needs. Whether you're buying, selling, or renting, we are here to make your property journey seamless, rewarding, and stress-free.</p>
            <p>Our dedicated team brings extensive market knowledge, local expertise, and a genuine passion for property to every client we serve. We take the time to truly understand your goals, ensuring that each recommendation we make is aligned with your lifestyle and vision.</p>
            <p>With a commitment to integrity, excellence, and outstanding customer care, NC Properties has become a trusted name in the industry. From first-time buyers to seasoned investors, we offer guidance, support, and top-tier service throughout the entire process.</p>
            <p>Thank you for choosing NC Properties. We look forward to helping you discover your next home, investment, or dream property, with confidence and peace of mind.</p>
          </div>
        </article>
      </div>
    </section>
  );
}

export default function Home() {
    const [properties, setProperties] = useState<Property[]>([]);

    useEffect(() => {
        const fetchProps = async () => {
            const props = await getProperties();
            setProperties(props);
        }
        fetchProps();
    }, []);

    const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://nelson-chauke-prop.web.app/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://nelson-chauke-prop.web.app/properties?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <div className="flex flex-col bg-background">
        <HeroSection properties={properties} />
        <FeaturedPropertiesSection />
        <ShortAboutSection />
        <CtaTabsSection />
        <NewsletterSection />
      </div>
    </>
  );
}
