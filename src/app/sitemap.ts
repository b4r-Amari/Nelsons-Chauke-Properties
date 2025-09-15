import { MetadataRoute } from 'next'
import propertiesData from '@/data/properties.json';
import blogData from '@/data/blog.json';
import agentsData from '@/data/agents.json';

const BASE_URL = 'https://nelson-chauke-prop.web.app';

export default function sitemap(): MetadataRoute.Sitemap {
  
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
  
  const propertyPages = propertiesData.map(property => ({
    url: `${BASE_URL}/properties/${property.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  
  const blogPostPages = blogData.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const agentPages = agentsData.map(agent => ({
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
