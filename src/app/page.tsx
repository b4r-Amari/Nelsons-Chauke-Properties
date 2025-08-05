import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Search, Building, KeyRound, Handshake } from 'lucide-react';
import { PropertyCard } from '@/components/shared/property-card';
import type { Property } from '@/components/shared/property-card';
import Link from 'next/link';
import propertiesData from '@/data/properties.json';

const featuredProperties: Property[] = propertiesData.filter(p => p.isFavorite && p.status === 'for-sale').slice(0, 8);

export default function Home() {
  return (
    <div className="flex flex-col bg-background">
      <HeroSection />
      <FeaturedPropertiesSection />
      <CtaTabsSection />
      <NewsletterSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tight text-brand-deep">We have space for you</h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">Discover the finest properties for sale and rent across South Africa. Your new home is just a search away.</p>
            </div>
            <Card className="w-full max-w-4xl mx-auto shadow-lg border-none bg-background">
              <CardContent className="p-4">
                <form className="grid md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-3">
                     <Select defaultValue="for-sale">
                      <SelectTrigger className="h-14 text-base border-0 focus:ring-0 shadow-none">
                        <SelectValue placeholder="For Sale" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="for-sale">For Sale</SelectItem>
                        <SelectItem value="to-let">To Let</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="md:col-span-6">
                    <Input type="text" placeholder="Enter city, suburb or area" className="h-14 text-base border-0 focus-visible:ring-offset-0 focus-visible:ring-2" />
                  </div>
                  <div className="md:col-span-3">
                    <Button type="submit" size="lg" className="w-full h-14 bg-brand-bright hover:bg-brand-deep transition-colors duration-300 text-lg">
                      <Search className="mr-2 h-6 w-6" />
                      Search
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
}


function FeaturedPropertiesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <h2 className="text-3xl font-bold text-center font-headline mb-4">Featured Properties</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Discover our curated selection of premier properties in South Africa, offering the perfect blend of luxury, comfort, and style.</p>
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {featuredProperties.map((prop) => (
              <CarouselItem key={prop.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 xl:basis-1/4">
                 <PropertyCard property={prop} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-brand-deep text-white hover:bg-brand-deep/90 border-none -left-4" />
          <CarouselNext className="bg-brand-deep text-white hover:bg-brand-deep/90 border-none -right-4" />
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

function CtaTabsSection() {
  const buyerOptions = [
    { title: "Property Alerts", description: "Get instant alerts on new properties that match your unique search criteria.", buttonText: "Sign Up Now", imageSrc: "https://placehold.co/150x150", imageHint: "notification bell" },
    { title: "Sold Prices", description: "Research the value of any property in South Africa to make informed decisions.", buttonText: "View Sold Prices", imageSrc: "https://placehold.co/150x150", imageHint: "price tag" },
    { title: "Buying Guides", description: "Our comprehensive guides cover everything you need to know about buying a home.", buttonText: "Explore Guides", imageSrc: "https://placehold.co/150x150", imageHint: "open book" },
  ];

  const renterOptions = [
    { title: "Find Letting Agents", description: "Connect with trusted and experienced letting agents in your desired area.", buttonText: "Search Agents", imageSrc: "https://placehold.co/150x150", imageHint: "handshake professional" },
    { title: "Rental Alerts", description: "Be the first to know about new rental properties as soon as they hit the market.", buttonText: "Sign Up Now", imageSrc: "https://placehold.co/150x150", imageHint: "email notification" },
    { title: "Renter's Advice", description: "Navigate the rental market with confidence using our collection of helpful articles.", buttonText: "Read Articles", imageSrc: "https://placehold.co/150x150", imageHint: "lightbulb idea" },
  ];

  const sellerOptions = [
    { title: "Free Property Valuation", description: "Get a free, instant, and accurate valuation for your property.", buttonText: "Get Started", imageSrc: "https://placehold.co/150x150", imageHint: "valuation chart" },
    { title: "Sold Prices", description: "Understand market trends by viewing the latest sold prices in your neighbourhood.", buttonText: "View Sold Prices", imageSrc: "https://placehold.co/150x150", imageHint: "house price" },
    { title: "Selling Guides", description: "Our guides provide all the information you need to sell your property successfully.", buttonText: "View Guides", imageSrc: "https://placehold.co/150x150", imageHint: "checklist clipboard" },
  ];

  return (
    <section className="py-24 bg-card">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-headline">Discover All Things Property</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Whether you're buying, renting, or selling, we have the tools and resources to help you succeed.</p>
        </div>
        <Tabs defaultValue="buying" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 bg-muted p-1 h-12 rounded-full">
            <TabsTrigger value="buying" className="rounded-full text-md data-[state=active]:bg-brand-bright data-[state=active]:text-white transition-all duration-300 flex items-center gap-2">
              <Building className="h-5 w-5" /> Buying
            </TabsTrigger>
            <TabsTrigger value="renting" className="rounded-full text-md data-[state=active]:bg-brand-bright data-[state=active]:text-white transition-all duration-300 flex items-center gap-2">
              <KeyRound className="h-5 w-5" /> Renting
            </TabsTrigger>
            <TabsTrigger value="selling" className="rounded-full text-md data-[state=active]:bg-brand-bright data-[state=active]:text-white transition-all duration-300 flex items-center gap-2">
              <Handshake className="h-5 w-5" /> Selling
            </TabsTrigger>
          </TabsList>
          <div className="pt-12">
            <TabsContent value="buying">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {buyerOptions.map(opt => <CtaTabCard key={opt.title} {...opt} />)}
              </div>
            </TabsContent>
            <TabsContent value="renting">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {renterOptions.map(opt => <CtaTabCard key={opt.title} {...opt} />)}
              </div>
            </TabsContent>
            <TabsContent value="selling">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {sellerOptions.map(opt => <CtaTabCard key={opt.title} {...opt} />)}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
}


function CtaTabCard({ title, description, buttonText, imageSrc, imageHint }: { title: string, description: string, buttonText: string, imageSrc: string, imageHint: string }) {
  return (
    <Card className="text-center shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
      <CardContent className="p-6 flex-grow flex flex-col items-center">
        <Image src={imageSrc} data-ai-hint={imageHint} alt={title} width={150} height={150} className="rounded-full w-32 h-32 object-cover mb-6 border-4 border-white shadow-md" />
        <h3 className="text-xl font-bold font-headline mb-2 text-brand-deep">{title}</h3>
        <p className="text-muted-foreground flex-grow mb-6">{description}</p>
        <Button variant="outline" className="border-brand-bright text-brand-bright hover:bg-brand-bright hover:text-white transition-colors w-full mt-auto">
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}


function NewsletterSection() {
  return (
    <section className="py-24 bg-background relative">
       <Image
          src="https://placehold.co/1920x400"
          alt="Abstract background"
          data-ai-hint="abstract geometric"
          fill
          style={{objectFit:"cover"}}
          className="opacity-10"
        />
      <div className="container relative">
        <Card className="max-w-2xl mx-auto shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <h2 className="text-3xl font-bold font-headline">Stay Ahead of the Market</h2>
            <p className="text-muted-foreground">Subscribe to our newsletter for the latest property listings, market news, and exclusive tips.</p>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col sm:flex-row gap-4">
              <Input type="email" placeholder="Enter your email address" className="flex-grow h-12" />
              <Button type="submit" size="lg" className="h-12 bg-brand-deep hover:bg-brand-bright transition-colors">Subscribe</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
