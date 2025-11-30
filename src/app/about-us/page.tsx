
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import Link from 'next/link';
import { getAgents } from '@/lib/data';
import placeholders from '@/lib/placeholder-images.json';
import { useEffect, useState } from 'react';
import { type Agent } from '@/components/shared/agent-card';
import { Skeleton } from '@/components/ui/skeleton';

const timelineEvents = [
  { year: '2010', title: 'Foundation', description: 'NC Properties was founded with a mission to simplify the home-buying process.' },
  { year: '2014', title: 'First 100 Sales', description: 'Celebrated our 100th successful property sale, a major milestone for our growing team.' },
  { year: '2018', title: 'Expanded to Rentals', description: 'Launched our rental division, offering the same quality service to tenants and landlords.' },
  { year: '2022', title: 'Digital Transformation', description: 'Redefined our online presence with a new, user-friendly website and digital tools.' },
  { year: 'Today', title: 'Industry Leader', description: 'Recognized as a leading property firm in the region, serving thousands of happy clients.' },
];

export default function AboutUsPage() {
  const [teamMembers, setTeamMembers] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      const agents = await getAgents();
      setTeamMembers(agents);
      setLoading(false);
    };
    fetchAgents();
  }, []);

  return (
    <>
      <section 
        className="relative bg-brand-deep text-white py-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/backgrounds/about.webp')"}}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative text-center">
          <h1 className="text-4xl font-bold font-headline">About NC Properties</h1>
          <p className="text-lg mt-2 text-white/80">Our Story, Our Mission, Our Team</p>
        </div>
      </section> 

      <main>
        <section className="py-24 bg-background">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <article className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold font-headline mb-4">Redefining Real Estate</h2>
                <p>Since our inception, NC Properties has been driven by a singular vision: to create a real estate experience that is seamless, transparent, and built on trust. We believe that finding a home is more than a transaction; it's the beginning of a new chapter in life.</p>
                <p>Our team of dedicated professionals combines deep market knowledge with a passion for client satisfaction. We leverage innovative technology and a personalized approach to ensure that every client—whether buying, selling, or renting—achieves their property goals with confidence.</p>
                <Button className="mt-4 bg-brand-bright hover:bg-brand-deep transition-colors">
                  <Download className="mr-2 h-4 w-4" />
                  Download Our Brochure
                </Button>
              </article>
              <div>
                <Image src={placeholders.modernOffice.url} alt="The modern and bright office interior of NC Properties with team members collaborating." data-ai-hint={placeholders.modernOffice.hint} width={600} height={400} className="rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-24 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold text-center font-headline mb-12">Our Journey</h2>
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-brand-bright/30 md:left-1/2 md:-translate-x-1/2" aria-hidden="true"></div>
              {timelineEvents.map((event, index) => (
                <div key={index} className="relative mb-12 group">
                  <div className="flex items-center md:group-even:flex-row-reverse">
                    <div className="md:w-1/2 md:pr-8">
                       <Card className="shadow-lg md:group-even:text-left md:text-right">
                        <CardHeader>
                          <p className="text-sm text-brand-bright font-bold">{event.year}</p>
                          <CardTitle className="font-headline">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{event.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-background rounded-full border-4 border-brand-bright flex items-center justify-center" aria-hidden="true">
                      <div className="w-3 h-3 bg-brand-bright rounded-full"></div>
                    </div>
                    <div className="md:w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-24 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold text-center font-headline mb-12">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {loading ? (
                 Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="text-center shadow-lg h-full p-6 space-y-4">
                      <Skeleton className="h-40 w-40 rounded-full mx-auto" />
                      <Skeleton className="h-8 w-3/4 mx-auto" />
                      <Skeleton className="h-6 w-1/2 mx-auto" />
                  </Card>
                 ))
              ) : (
                teamMembers.map((member) => (
                  <Link href={`/agents/${member.slug}`} key={member.id} className="group block">
                    <Card className="text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 h-full">
                      <CardContent className="p-6">
                        <Image src={member.imageUrl} data-ai-hint={member.imageHint} alt={`Portrait of ${member.name}, ${member.role} at NC Properties.`} width={200} height={200} className="rounded-full mx-auto mb-4 border-4 border-white shadow-md object-cover w-[200px] h-[200px]" />
                        <h3 className="text-xl font-bold font-headline text-brand-deep group-hover:text-brand-bright transition-colors">{member.name}</h3>
                        <p className="text-brand-deep font-semibold">{member.role}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
