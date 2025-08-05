
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Search, Building, KeyRound, Handshake } from 'lucide-react';
import { PropertyCard } from '@/components/shared/property-card';
import type { Property } from '@/components/shared/property-card';
import Link from 'next/link';
import propertiesData from '@/data/properties.json';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const featuredProperties: Property[] = propertiesData.filter(p => p.isFavorite && p.status === 'for-sale').slice(0, 8);

export default function Home() {
  return (
    <div className="flex flex-col bg-background">
      <HeroSection />
      <FeaturedPropertiesSection />
      <ShortAboutSection />
      <CtaTabsSection />
      <NewsletterSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-white">
      <Image
        src="https://placehold.co/1920x1080"
        alt="Modern home interior"
        data-ai-hint="modern home interior"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 container text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tight text-white drop-shadow-md">
          We have space for you
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl drop-shadow-md">
          Discover the finest properties for sale and rent across South Africa. Your new home is just a search away.
        </p>
        <Card className="w-full max-w-5xl mx-auto shadow-2xl bg-white/50 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <form className="grid md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-3">
                <Select defaultValue="for-sale">
                  <SelectTrigger className="h-14 text-base bg-white text-black border-input focus:ring-2 focus:ring-brand-bright focus:ring-offset-0">
                    <SelectValue placeholder="For Sale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="for-sale">For Sale</SelectItem>
                    <SelectItem value="to-let">To Let</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3">
                <Select defaultValue="residential">
                  <SelectTrigger className="h-14 text-base bg-white text-black border-input focus:ring-2 focus:ring-brand-bright focus:ring-offset-0">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="residential-development">Residential Development</SelectItem>
                    <SelectItem value="residential-estate">Residential Estate</SelectItem>
                    <SelectItem value="residential-vacant-land">Residential Vacant Land</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="agricultural">Agricultural</SelectItem>
                    <SelectItem value="farms-small-holdings">Farms & Small Holdings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-4">
                <Input
                  type="text"
                  placeholder="Enter city, suburb or area"
                  className="h-14 text-base bg-white text-black border-input focus:ring-2 focus:ring-brand-bright focus:ring-offset-0 placeholder:text-gray-600"
                />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" size="lg" className="w-full h-14 bg-brand-bright hover:bg-brand-deep transition-colors duration-300 text-lg">
                  <Search className="mr-2 h-6 w-6" />
                  Search
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
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
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold font-headline text-brand-deep">Welcome to NC Properties</h2>
          <Separator className="w-24 h-1 bg-brand-bright mx-auto my-6" />
          <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-4">
            <p>At NC Properties, we pride ourselves on offering a personalised and professional real estate experience tailored to your needs. Whether you're buying, selling, or renting, we are here to make your property journey seamless, rewarding, and stress-free.</p>
            <p>Our dedicated team brings extensive market knowledge, local expertise, and a genuine passion for property to every client we serve. We take the time to truly understand your goals, ensuring that each recommendation we make is aligned with your lifestyle and vision.</p>
            <p>With a commitment to integrity, excellence, and outstanding customer care, NC Properties has become a trusted name in the industry. From first-time buyers to seasoned investors, we offer guidance, support, and top-tier service throughout the entire process.</p>
            <p>Thank you for choosing NC Properties. We look forward to helping you discover your next home, investment, or dream property, with confidence and peace of mind.</p>
          </div>
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
    <section className="py-24 bg-background">
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
          <TabsContent value="buying" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {buyerOptions.map(opt => <CtaTabCard key={opt.title} {...opt} />)}
            </div>
          </TabsContent>
          <TabsContent value="renting" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {renterOptions.map(opt => <CtaTabCard key={opt.title} {...opt} />)}
            </div>
          </TabsContent>
          <TabsContent value="selling" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sellerOptions.map(opt => <CtaTabCard key={opt.title} {...opt} />)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}


function CtaTabCard({ title, description, buttonText, imageSrc, imageHint }: { title: string, description: string, buttonText: string, imageSrc: string, imageHint: string }) {
  return (
    <Card className="text-center shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col bg-card">
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
    <section className="py-24 bg-card relative">
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
