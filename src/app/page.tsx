
import Image from 'next/image';
import { Suspense } from 'react';
import { PropertyCard } from '@/components/shared/property-card';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { CtaTabsSection, NewsletterSection } from '@/components/sections/home-page-sections';
import { getProperties } from '@/lib/data';
import { PropertyFilter } from '@/components/shared/property-filter';

async function HeroSection() {
  const properties = await getProperties();
  const heroBanners = [
    '/images/backgrounds/hero-banner-1.webp',
    '/images/backgrounds/hero-banner-2.webp',
    '/images/backgrounds/hero-banner-3.webp',
    '/images/backgrounds/hero-banner-4.webp'
  ];
  const bannerImage = heroBanners[Math.floor(Math.random() * heroBanners.length)];

  return (
    <section className="relative h-[70vh] min-h-[550px] flex items-center justify-center text-white">
      <Image
        src={bannerImage}
        alt="Modern and sophisticated home interior by NC Properties"
        data-ai-hint="modern home interior"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 container text-center flex flex-col items-center pt-32 md:pt-20">
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tight text-white drop-shadow-md">
          We have space for you
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl drop-shadow-md">
          Discover the finest properties for sale and rent across South Africa. Your new home is just a search away.
        </p>
        <div className="w-full max-w-4xl mx-auto mt-8 bg-black/50 backdrop-blur-md border border-black/20 p-4 rounded-lg shadow-2xl">
            <Suspense fallback={<div className="h-20 w-full bg-muted/20 animate-pulse rounded-lg" />}>
                <PropertyFilter properties={properties} />
            </Suspense>
        </div>
      </div>
    </section>
  );
}

async function FeaturedPropertiesSection() {
  const allProperties = await getProperties();
  const featuredProperties = allProperties.filter(p => p.isFavorite);

  if (featuredProperties.length === 0) return null;

  return (
    <section className="py-24 bg-background relative mt-32 md:mt-0">
      <div className="container">
        <h2 className="text-3xl font-bold text-center font-headline mb-4">Featured Properties</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Discover our curated selection of premier properties, offering the perfect blend of luxury, comfort, and style.</p>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {featuredProperties.map((prop) => (
              <CarouselItem key={prop.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <PropertyCard property={prop} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
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
          </div>
        </article>
      </div>
    </section>
  );
}

export default async function Home() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Nelson Chauke Properties",
    "url": "https://nc-properties.vercel.app/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://nc-properties.vercel.app/properties?q={search_term_string}",
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
        <HeroSection />
        <FeaturedPropertiesSection />
        <ShortAboutSection />
        <CtaTabsSection />
        <NewsletterSection />
      </div>
    </>
  );
}
