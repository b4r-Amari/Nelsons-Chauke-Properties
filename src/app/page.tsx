
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { PropertyCard } from '@/components/shared/property-card';
import type { Property } from '@/components/shared/property-card';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { CtaTabsSection, NewsletterSection } from '@/components/sections/home-page-sections';
import { getProperties } from '@/lib/data';
import { PropertyFilter } from '@/components/shared/property-filter';

// Since this is a Server Component, we need to make it async to fetch data
async function HeroSection() {
  const properties = await getProperties();
  const heroBanners = [
    '/images/backgrounds/hero-banner-1.webp',
    '/images/backgrounds/hero-banner-2.webp',
    '/images/backgrounds/hero-banner-3.webp',
    '/images/backgrounds/hero-banner-4.webp'
  ];
  // Note: Math.random() is safe to use in a Server Component for this use case
  // because it runs once at build time or request time, not on the client.
  const bannerImage = heroBanners[Math.floor(Math.random() * heroBanners.length)];

  return (
    <section className="relative h-[70vh] min-h-[550px] flex items-center justify-center text-white">
      <Image
        src={bannerImage}
        alt="A beautiful, modern home interior, representing the quality properties offered by NC Properties."
        data-ai-hint="modern home interior"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 container text-center flex flex-col items-center pt-32">
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tight text-white drop-shadow-md">
          We have space for you
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl drop-shadow-md">
          Discover the finest properties for sale and rent across South Africa. Your new home is just a search away.
        </p>
        <div className="w-full max-w-4xl mx-auto mt-8 bg-black/50 backdrop-blur-md border border-black/20 p-4 rounded-lg shadow-2xl">
            <PropertyFilter properties={properties} />
        </div>
      </div>
    </section>
  );
}

// Fetching featured properties on the server
async function FeaturedPropertiesSection() {
  const featuredProperties = await getProperties({ featuredOnly: true });

  return (
    <section className="py-24 bg-background relative">
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
            <p>With a commitment to integrity, excellence, and outstanding customer care, NC Properties has become a trusted name in the industry. From first-time buyers to seasoned investors, we offer guidance, support, and top-tier service throughout the entire process.</p>
            <p>Thank you for choosing NC Properties. We look forward to helping you discover your next home, investment, or dream property, with confidence and peace of mind.</p>
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
        <HeroSection />
        <FeaturedPropertiesSection />
        <ShortAboutSection />
        <CtaTabsSection />
        <NewsletterSection />
      </div>
    </>
  );
}
