
import { MetadataRoute } from 'next'
import { getProperties, getBlogPosts, getAgents } from '@/lib/data';

const BASE_URL = 'https://nelson-chauke-prop.web.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  const staticPages = [
    '/',
    '/properties',
    '/properties/on-show',
    '/properties/sold',
    '/sell',
    '/blog',
    '/about-us',
    '/contact-us',
  ].map(route => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1 : 0.8,
  }));
  
  const properties = await getProperties();
  const propertyPages = properties.map(property => ({
    url: `${BASE_URL}/properties/${property.id}`,
    lastModified: new Date(), 
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  
  const blogPosts = await getBlogPosts();
  const blogPostPages = blogPosts.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const agents = await getAgents();
  const agentPages = agents.map(agent => ({
    url: `${BASE_URL}/agents/${agent.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...propertyPages,
    ...blogPostPages,
    ...agentPages,
  ];
}
