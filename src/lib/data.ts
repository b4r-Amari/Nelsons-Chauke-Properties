
import { type Property } from '@/components/shared/property-card';
import { type Agent } from '@/components/shared/agent-card';
import { type BlogPost } from '@/components/shared/blog-card';

import propertiesData from '@/data/properties.json';
import agentsData from '@/data/agents.json';
import blogData from '@/data/blog.json';

// Properties
export async function getProperties(options: { featuredOnly?: boolean } = {}): Promise<Property[]> {
  let properties = propertiesData as Property[];
  if (options.featuredOnly) {
    properties = properties.filter(p => p.isFavorite && p.status === 'for-sale').slice(0, 8);
  }
  return properties;
}

export async function getProperty(id: string): Promise<Property | null> {
  const property = (propertiesData as Property[]).find(p => p.id.toString() === id);
  return property || null;
}

// Agents
export async function getAgents(): Promise<Agent[]> {
  return agentsData as Agent[];
}

export async function getAgent(slug: string): Promise<Agent | null> {
  const agent = (agentsData as Agent[]).find(a => a.slug === slug);
  return agent || null;
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
    const posts = blogData.map(post => ({
        ...post,
        id: post.slug
    }));
    return posts as BlogPost[];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const post = (blogData as Omit<BlogPost, 'id'>[]).find(p => p.slug === slug);
  if (post) {
      return { ...post, id: post.slug } as BlogPost;
  }
  return null;
}
