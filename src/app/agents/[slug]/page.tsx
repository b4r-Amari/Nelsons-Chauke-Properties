
"use client";

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { getAgent, getProperties } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PropertyCard, type Property } from '@/components/shared/property-card';
import { type Agent } from '@/components/shared/agent-card';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingSkeleton() {
  return (
    <div className="container py-12 md:py-24">
      <Skeleton className="h-8 w-1/4 mb-8" />
       <div className="grid lg:grid-cols-3 gap-12">
        <aside className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg text-center p-8 space-y-4">
              <Skeleton className="h-48 w-48 rounded-full mx-auto" />
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
              <Separator className="my-6" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-12 w-full mt-4" />
          </Card>
        </aside>
        <article className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
            </div>
             <div className="space-y-4">
              <Skeleton className="h-10 w-1/3" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-4">
                    <Skeleton className="h-[250px] w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                   <div className="space-y-4">
                    <Skeleton className="h-[250px] w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
               </div>
            </div>
        </article>
      </div>
    </div>
  )
}

export default function AgentProfilePage({ params }: { params: { slug: string } }) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [agentProperties, setAgentProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgentData = async () => {
      setLoading(true);
      const agentData = await getAgent(params.slug);
      if (!agentData) {
        notFound();
      }
      setAgent(agentData);
      
      const allProperties = await getProperties();
      setAgentProperties(allProperties.filter(p => p.agentIds.includes(agentData.id) && p.status !== 'sold'));
      setLoading(false);
    }
    fetchAgentData();
  }, [params.slug]);


  if (loading || !agent) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="bg-background">
      <main className="container py-12 md:py-24">
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
                            alt={`Professional portrait of ${agent.name}, ${agent.role}`} 
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

            <article className="lg:col-span-2">
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
            </article>
        </div>
      </main>
    </div>
  );
}
