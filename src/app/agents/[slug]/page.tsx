
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone } from 'lucide-react';

import agentsData from '@/data/agents.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PropertyCard, type Property } from '@/components/shared/property-card';
import propertiesData from '@/data/properties.json';


type Agent = (typeof agentsData)[0];

const agents: Agent[] = agentsData;
const allProperties: Property[] = propertiesData;

export async function generateStaticParams() {
  return agents.map((agent) => ({
    slug: agent.slug,
  }));
}

function getAgent(slug: string) {
  return agents.find((agent) => agent.slug === slug);
}

export default function AgentProfilePage({ params }: { params: { slug: string } }) {
  const agent = getAgent(params.slug);

  if (!agent) {
    notFound();
  }

  // In a real app, you'd likely have a mapping of agents to properties.
  // For this demo, we'll just assign a few active properties to the main agent for display.
  const agentProperties = allProperties.filter(p => p.agentId === agent.id && p.status !== 'sold');

  return (
    <div className="bg-background">
      <div className="container py-12 md:py-24">
        <div className="mb-8">
            <Link href="/about-us" className="inline-flex items-center text-brand-deep hover:text-brand-bright transition-colors font-semibold">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Our Team
            </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
            <aside className="lg:col-span-1">
                <Card className="sticky top-24 shadow-lg text-center">
                    <CardContent className="p-8">
                        <Image 
                            src={agent.imageUrl} 
                            data-ai-hint={agent.imageHint} 
                            alt={`Portrait of ${agent.name}`} 
                            width={200} 
                            height={200} 
                            className="rounded-full mx-auto mb-6 border-4 border-white shadow-xl object-cover w-[200px] h-[200px]" 
                        />
                        <h1 className="text-3xl font-bold font-headline text-brand-deep">{agent.name}</h1>
                        <p className="text-lg font-semibold text-brand-bright mb-6">{agent.role}</p>
                        
                        <Separator className="my-6" />

                        <div className="space-y-4 text-left">
                             <a href={`mailto:${agent.email}`} className="flex items-center gap-4 group">
                                <Mail className="h-6 w-6 text-brand-deep" />
                                <span className="text-muted-foreground group-hover:text-brand-bright transition-colors">{agent.email}</span>
                            </a>
                            <a href={`tel:${agent.phone.replace(/\D/g, '')}`} className="flex items-center gap-4 group">
                                <Phone className="h-6 w-6 text-brand-deep" />
                                <span className="text-muted-foreground group-hover:text-brand-bright transition-colors">{agent.phone}</span>
                            </a>
                        </div>
                        <Button className="w-full mt-8 bg-brand-bright hover:bg-brand-deep transition-colors" size="lg">
                            Contact {agent.name.split(' ')[0]}
                        </Button>
                    </CardContent>
                </Card>
            </aside>

            <main className="lg:col-span-2">
                <div className="prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-brand-deep">
                    <h2>About {agent.name}</h2>
                    <div dangerouslySetInnerHTML={{ __html: agent.bio }} />

                    {agentProperties.length > 0 && (
                        <>
                            <Separator className="my-12" />
                            <h2>{agent.name.split(' ')[0]}'s Active Listings</h2>
                        </>
                    )}
                </div>
                 {agentProperties.length > 0 && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {agentProperties.map(prop => (
                            <PropertyCard key={prop.id} property={prop} />
                        ))}
                    </div>
                 )}
            </main>
        </div>
      </div>
    </div>
  );
}
