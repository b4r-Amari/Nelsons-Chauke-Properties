
import { MetadataRoute } from 'next';
import { getProperties, getAgents, getBlogPosts } from '@/lib/data';
import { Property } from '@/components/shared/property-card';
import { Agent } from '@/components/shared/agent-card';
import { BlogPost } from '@/components/shared/blog-card';

// Helper function to convert Firestore Timestamps or date strings to ISO 8601 strings
const toISOString = (timestamp: any): string => {
  if (!timestamp) {
    return new Date().toISOString();
  }
  if (typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  // Attempt to parse if it's a string date
  const date = new Date(timestamp);
  if (!isNaN(date.getTime())) {
    return date.toISOString();
  }
  return new Date().toISOString();
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nc-properties.vercel.app';

  // Define static pages
  const staticPages = [
    '/',
    '/about-us',
    '/properties',
    '/properties/sold',
    '/blog',
    '/calculators',
    '/contact-us',
    '/sell',
    '/login',
  ];

  const staticUrls = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as 'monthly',
    priority: path === '/' ? 1.0 : 0.8,
  }));

  // Fetch dynamic data
  const properties = (await getProperties()) as Property[];
  const agents = (await getAgents()) as Agent[];
  const blogPosts = (await getBlogPosts()) as BlogPost[];

  const propertyUrls = properties.map((property) => ({
    url: `${baseUrl}/properties/${property.id}`,
    lastModified: toISOString(property.updatedAt),
    changeFrequency: 'weekly' as 'weekly',
    priority: 0.9,
  }));

  const agentUrls = agents.map((agent) => ({
    url: `${baseUrl}/agents/${agent.slug}`,
    lastModified: toISOString(agent.updatedAt), // Defaults to now if updatedAt is missing
    changeFrequency: 'monthly' as 'monthly',
    priority: 0.7,
  }));

  const blogPostUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: toISOString(post.updatedAt || post.date), // Fallback to the post's date
    changeFrequency: 'weekly' as 'weekly',
    priority: 0.7,
  }));

  return [
    ...staticUrls,
    ...propertyUrls,
    ...agentUrls,
    ...blogPostUrls,
  ];
}
