
import { MetadataRoute } from 'next';
import { getProperties, getAgents, getBlogPosts } from '@/lib/data';
import type { Property, Agent, BlogPost } from '@/lib/types';

export const dynamic = 'force-dynamic';

const toISOString = (timestamp: any): string => {
  if (!timestamp) return new Date().toISOString();
  const date = new Date(timestamp);
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nelsonchaukeproperties.co.za';

  // Define static pages
  const staticPages = [
    '',
    '/about-us',
    '/properties',
    '/properties/sold',
    '/properties/on-show',
    '/blog',
    '/calculators',
    '/contact-us',
    '/sell',
  ];

  const staticUrls = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  // Fetch dynamic data
  const [properties, agents, blogPosts] = await Promise.all([
    getProperties(),
    getAgents(),
    getBlogPosts()
  ]);

  const propertyUrls = properties.map((property) => ({
    url: `${baseUrl}/properties/${property.id}`,
    lastModified: toISOString(property.updatedAt || property.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const agentUrls = agents.map((agent) => ({
    url: `${baseUrl}/agents/${agent.slug || agent.id}`,
    lastModified: toISOString(agent.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const blogPostUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: toISOString(post.updatedAt || post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    ...staticUrls,
    ...propertyUrls,
    ...agentUrls,
    ...blogPostUrls,
  ];
}
