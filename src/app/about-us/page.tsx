
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MinusCircle } from 'lucide-react';
import Link from 'next/link';
import { getAgents } from '@/lib/data';
import placeholders from '@/lib/placeholder-images.json';
import { TimelineSection } from '@/components/sections/about-us-sections';

export default async function AboutUsPage() {
  const teamMembers = await getAgents();

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
              </article>
              <div>
                <Image src={placeholders.modernOffice.url} alt="The modern and bright office interior of NC Properties with team members collaborating." data-ai-hint={placeholders.modernOffice.hint} width={600} height={400} className="rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        </section>
        
        <TimelineSection />
        
        <section id='team' className="py-24 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold text-center font-headline mb-12">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {teamMembers.map((member) => (
                  <Link href={`/agents/${member.slug}`} key={member.id} className="group block">
                    <Card className="text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 h-full">
                      <CardContent className="p-6">
                        <Image src={member.photoUrl || placeholders.agentProfile.url} alt={`Portrait of ${member.name}, ${member.role} at NC Properties.`} width={200} height={200} className="rounded-full mx-auto mb-4 border-4 border-white shadow-md object-cover w-[200px] h-[200px]" />
                        <h3 className="text-xl font-bold font-headline text-brand-deep group-hover:text-brand-bright transition-colors">{member.name}</h3>
                        <p className="text-brand-deep font-semibold">{member.role}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
