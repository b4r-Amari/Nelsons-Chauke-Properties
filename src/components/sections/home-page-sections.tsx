
"use client"

import { PropertyCard, type Property } from "@/components/shared/property-card";
import { BlogCard, type BlogPost } from "@/components/shared/blog-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building, Handshake, KeyRound } from "lucide-react";
import placeholders from "@/lib/placeholder-images.json";
import { getProperties, getBlogPosts } from "@/lib/data";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { addMarketingLead } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Card, CardContent, CardHeader } from "../ui/card";

// Section: Featured Properties
export function FeaturedPropertiesSection() {
    const [properties, setProperties] = useState<Property[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const props = await getProperties({ featuredOnly: true });
            setProperties(props);
        };
        fetchData();
    }, []);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Featured Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map(property => <PropertyCard key={property.id} property={property} />)}
      </div>
    </div>
  );
}

// Section: For Sale Properties
export function ForSalePropertiesSection() {
     const [properties, setProperties] = useState<Property[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const props = await getProperties({ status: 'for-sale', limit: 6 });
            setProperties(props);
        };
        fetchData();
    }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">For Sale</h2>
        <Button variant="outline" asChild>
            <Link href="/properties?status=for-sale">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map(property => <PropertyCard key={property.id} property={property} />)}
      </div>
    </div>
  );
}

// Section: For Rent Properties
export function ForRentPropertiesSection() {
     const [properties, setProperties] = useState<Property[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const props = await getProperties({ status: 'to-let', limit: 6 });
            setProperties(props);
        };
        fetchData();
    }, []);

  return (
    <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">For Rent</h2>
            <Button variant="outline" asChild>
                <Link href="/properties?status=to-let">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map(property => <PropertyCard key={property.id} property={property} />)}
      </div>
    </div>
  );
}

// Section: Recently Sold Properties
export function RecentlySoldPropertiesSection() {
     const [properties, setProperties] = useState<Property[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const props = await getProperties({ status: 'sold', limit: 3 });
            setProperties(props);
        };
        fetchData();
    }, []);

  return (
    <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Recently Sold</h2>
            <Button variant="outline" asChild>
                <Link href="/properties/sold">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(property => <PropertyCard key={property.id} property={property} />)}
        </div>
    </div>
  );
}

// Section: CTA Tabs
export function CtaTabsSection() {
  const buyerOptions = [
    { id: 'property-alerts', title: "Property Alerts", description: "Get instant alerts on new properties that match your unique search criteria.", buttonText: "Sign Up Now", imageSrc: placeholders.propertyAlert.url, imageHint: placeholders.propertyAlert.hint },
    { id: 'buying-guides', title: "Buying Guides", description: "Our comprehensive guides cover everything you need to know about buying a home.", buttonText: "Explore Guides", imageSrc: placeholders.buyingGuides.url, imageHint: placeholders.buyingGuides.hint, href: "/blog" },
  ];

  const renterOptions = [
    { title: "Find Letting Agents", description: "Connect with trusted and experienced letting agents in your desired area.", buttonText: "Search Agents", imageSrc: placeholders.findLettingAgents.url, imageHint: placeholders.findLettingAgents.hint, href: "/about-us" },
    { id: 'rental-alerts', title: "Rental Alerts", description: "Be the first to know about new rental properties as soon as they hit the market.", buttonText: "Sign Up Now", imageSrc: placeholders.rentalAlerts.url, imageHint: placeholders.rentalAlerts.hint },
    { title: "Renter's Advice", description: "Navigate the rental market with confidence using our collection of helpful articles.", buttonText: "Read Articles", imageSrc: placeholders.rentersAdvice.url, imageHint: placeholders.rentersAdvice.hint, href: "/blog" },
  ];

  const sellerOptions = [
    { title: "Free Property Valuation", description: "Get a free, instant, and accurate valuation for your property.", buttonText: "Get Started", imageSrc: placeholders.freePropertyValuation.url, imageHint: placeholders.freePropertyValuation.hint, href: "/sell" },
    { id: 'selling-guides', title: "Selling Guides", description: "Our guides provide all the information you need to sell your property successfully.", buttonText: "View Guides", imageSrc: placeholders.sellingGuides.url, imageHint: placeholders.sellingGuides.hint, href: "/blog" },
  ];

  const { toast } = useToast();

  const newsletterFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
  });

  const CtaTabCard = ({ title, description, buttonText, imageSrc, imageHint, href = "#", id }: { title: string, description: string, buttonText: string, imageSrc: string, imageHint: string, href?: string, id?: string }) => {
    const form = useForm<z.infer<typeof newsletterFormSchema>>({
      resolver: zodResolver(newsletterFormSchema),
      defaultValues: { email: "" },
    });

    async function onSubmit(values: z.infer<typeof newsletterFormSchema>) {
      const result = await addMarketingLead({ email: values.email, source: id || 'cta-card-signup' });
      if (result.success) {
        toast({
          title: "Thank You!",
          description: "You've been signed up for alerts.",
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Could not sign up.",
        });
      }
    }

    const showForm = id === 'property-alerts' || id === 'rental-alerts';

    return (
      <div className="relative rounded-lg overflow-hidden text-white group aspect-[4/3] sm:aspect-video">
        <Image
          src={imageSrc}
          alt={imageHint}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full justify-end">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="mb-4 text-white/90">{description}</p>
          {showForm ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Your email address"
                          className="bg-white/10 border-white/30 text-white h-11 placeholder:text-white/70"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="h-11 bg-brand-bright hover:bg-brand-deep transition-colors" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "..." : buttonText}
                </Button>
              </form>
            </Form>
          ) : (
            <Button asChild className="bg-brand-bright hover:bg-brand-deep w-fit">
              <Link href={href}>{buttonText}</Link>
            </Button>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-headline">Discover All Things Property</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Whether you're buying, renting, or selling, we have the tools and resources to help you succeed.</p>
        </div>
        <div className="bg-card p-4 sm:p-8 rounded-lg shadow-lg">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {buyerOptions.map(opt => <CtaTabCard key={opt.title} {...opt} />)}
              </div>
            </TabsContent>
            <TabsContent value="renting" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {renterOptions.map(opt => <CtaTabCard key={opt.title} {...opt} />)}
              </div>
            </TabsContent>
            <TabsContent value="selling" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {sellerOptions.map(opt => <CtaTabCard key={opt.title} {...opt} />)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}


// Section: From the Blog
export function BlogSection() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const blogPosts = await getBlogPosts({ limit: 3 });
            setPosts(blogPosts);
        };
        fetchData();
    }, []);

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
                 <h2 className="text-3xl font-bold">From the Blog</h2>
                <Button variant="outline" asChild>
                    <Link href="/blog">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
                    <BlogCard key={post.slug} post={post} />
                ))}
            </div>
        </div>
    );
}

// Section: Newsletter
const newsletterFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export function NewsletterSection() {
  const { toast } = useToast();
  const mailImages = [
    'url("/images/backgrounds/mail-image.webp")',
    'url("/images/backgrounds/mail-image-2.webp")',
    'url("/images/backgrounds/mail-image-3.webp")',
    'url("/images/backgrounds/mail-image-4.webp")',
  ];
  
  const [bgImages, setBgImages] = useState(mailImages.slice(0,3).join(', '));

  const form = useForm<z.infer<typeof newsletterFormSchema>>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shuffled = [...mailImages].sort(() => 0.5 - Math.random());
      setBgImages(shuffled.slice(0, 3).join(', '));
    }
  }, []);

  async function onSubmit(values: z.infer<typeof newsletterFormSchema>) {
    const result = await addMarketingLead({ email: values.email, source: 'newsletter' });
    if (result.success) {
      toast({
        title: "Subscribed!",
        description: "You're now on our newsletter list. Welcome!",
      });
      form.reset();
    } else {
       toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Could not subscribe to the newsletter.",
      });
    }
  }


  return (
    <section 
      className="py-24 bg-card relative"
      style={{
        backgroundImage: bgImages,
        backgroundSize: '300px, 250px, 200px',
        backgroundPosition: 'right bottom, left top, center center',
        backgroundRepeat: 'no-repeat',
      }}
      aria-label="Newsletter subscription section"
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="container relative">
        <Card className="max-w-2xl mx-auto shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <h2 className="text-3xl font-bold font-headline">Stay Ahead of the Market</h2>
            <p className="text-muted-foreground">Subscribe to our newsletter for the latest property listings, market news, and exclusive tips.</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input type="email" placeholder="Enter your email address" className="h-12" aria-label="Email for newsletter" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="h-12 bg-brand-bright hover:bg-brand-deep transition-colors" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
