import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Globe, Award, ShieldCheck } from 'lucide-react';
import { getAgent, getProperties } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PropertyCard } from '@/components/shared/property-card';
import type { Metadata } from 'next';
import placeholders from '@/lib/placeholder-images.json';

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgent(slug);
  if (!agent) {
    return { title: 'Agent Not Found' };
  }
  return {
    title: `${agent.name} - ${agent.role}`,
    description: `Learn more about ${agent.name}, a dedicated real estate agent at NC Properties. View their listings and contact them for expert advice.`,
    openGraph: {
        title: `${agent.name} - ${agent.role}`,
        description: `Learn more about ${agent.name}, a dedicated real estate agent at NC Properties. View their listings and contact them for expert advice.`,
        images: [agent.photoUrl || placeholders.agentProfile.url]
    }
  }
}

export default async function AgentProfilePage({ params }: Props) {
  const { slug } = await params;
  const agent = await getAgent(slug);
  
  if (!agent) {
    notFound();
  }
  
  const agentProperties = await getProperties({ agentId: agent.id });
  const activeProperties = agentProperties.filter(p => p.status !== 'sold');

  const whatsappNumber = (agent.phone || '').replace(/\D/g, '');
  const whatsappLink = whatsappNumber ? `https://wa.me/27${whatsappNumber.slice(-9)}` : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": agent.name,
    "jobTitle": agent.role,
    "description": agent.bio,
    "image": agent.photoUrl || placeholders.agentProfile.url,
    "email": agent.email,
    "telephone": agent.phone,
    "worksFor": {
      "@type": "Organization",
      "name": "NC Properties"
    },
    "url": `https://nc-properties.vercel.app/agents/${agent.slug}`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-background min-h-screen">
        <main className="container py-12 md:py-20">
          <div className="mb-8">
              <Link href="/about-us#team" className="inline-flex items-center text-brand-deep hover:text-brand-bright transition-colors font-semibold">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Our Team
              </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
              <aside className="lg:col-span-1">
                  <Card className="sticky top-24 shadow-xl border-t-4 border-brand-bright">
                      <CardContent className="p-8 text-center">
                          <div className="relative w-48 h-48 mx-auto mb-6">
                              <Image 
                                  src={agent.photoUrl || placeholders.agentProfile.url} 
                                  alt={`Professional portrait of ${agent.name}`} 
                                  fill
                                  className="rounded-full border-4 border-white shadow-lg object-cover" 
                              />
                          </div>
                          <h1 className="text-3xl font-bold font-headline text-brand-deep mb-1">{agent.name}</h1>
                          <p className="text-lg font-semibold text-brand-bright mb-6">{agent.role}</p>
                          
                          <div className="flex justify-center gap-4 mb-8">
                              <div className="bg-muted p-2 rounded-full" title="Verified Agent">
                                  <ShieldCheck className="h-5 w-5 text-green-600" />
                              </div>
                              <div className="bg-muted p-2 rounded-full" title="Top Producer">
                                  <Award className="h-5 w-5 text-brand-bright" />
                              </div>
                          </div>

                          <Separator className="my-6" />

                          <div className="space-y-4 text-left">
                               <a href={`mailto:${agent.email}`} className="flex items-center gap-4 group">
                                  <div className="bg-brand-deep/10 p-2 rounded-md group-hover:bg-brand-bright/10 transition-colors">
                                      <Mail className="h-5 w-5 text-brand-deep group-hover:text-brand-bright" />
                                  </div>
                                  <span className="text-sm font-medium text-muted-foreground group-hover:text-brand-bright transition-colors truncate">{agent.email}</span>
                              </a>
                              {agent.phone && (
                                <a href={`tel:${agent.phone.replace(/\D/g, '')}`} className="flex items-center gap-4 group">
                                    <div className="bg-brand-deep/10 p-2 rounded-md group-hover:bg-brand-bright/10 transition-colors">
                                      <Phone className="h-5 w-5 text-brand-deep group-hover:text-brand-bright" />
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground group-hover:text-brand-bright transition-colors">{agent.phone}</span>
                                </a>
                              )}
                          </div>
                          
                          {whatsappLink && (
                            <Button asChild className="w-full mt-8 bg-brand-bright hover:bg-brand-deep transition-all shadow-md hover:shadow-lg" size="lg">
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                  Contact {agent.name.split(' ')[0]} on WhatsApp
                                </a>
                            </Button>
                          )}
                      </CardContent>
                  </Card>
              </aside>

              <article className="lg:col-span-2 space-y-12">
                  <section className="prose prose-lg dark:prose-invert max-w-none">
                      <h2 className="text-3xl font-bold font-headline text-brand-deep mb-6">About {agent.name}</h2>
                      {agent.bio ? (
                          <div className="text-muted-foreground leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: agent.bio }} />
                      ) : (
                          <p className="text-muted-foreground italic">No biography available for this agent.</p>
                      )}
                  </section>

                  <Separator />

                  <section>
                      <h2 className="text-3xl font-bold font-headline text-brand-deep mb-8">
                          {agent.name.split(' ')[0]}'s Active Listings
                          <span className="ml-3 text-sm font-normal text-muted-foreground">({activeProperties.length} properties)</span>
                      </h2>
                      
                      {activeProperties.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {activeProperties.map(prop => (
                                  <PropertyCard key={prop.id} property={prop} />
                              ))}
                          </div>
                      ) : (
                          <Card className="bg-muted/30 border-dashed">
                              <CardContent className="p-12 text-center text-muted-foreground">
                                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                  <p>This agent currently has no active public listings.</p>
                                  <Button variant="link" asChild className="mt-2 text-brand-bright">
                                      <Link href="/properties">View all properties</Link>
                                  </Button>
                              </CardContent>
                          </Card>
                      )}
                  </section>
              </article>
          </div>
        </main>
      </div>
    </>
  );
}
