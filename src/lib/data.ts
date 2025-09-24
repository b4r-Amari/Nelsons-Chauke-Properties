
import { type Property } from '@/components/shared/property-card';
import { type Agent } from '@/components/shared/agent-card';
import { type BlogPost } from '@/components/shared/blog-card';
import { getProperty as getPropertyFromDb, getAgent as getAgentFromDb, getBlogPost as getBlogPostFromDb } from './firebase/firestore';

import properties from '@/data/properties.json';
import agents from '@/data/agents.json';
import blog from '@/data/blog.json';

// Properties
export async function getProperties(options: { featuredOnly?: boolean; status?: 'on-show' | 'sold' } = {}): Promise<Property[]> {
  let propertyList: Property[] = properties as Property[];

  if (options.featuredOnly) {
    propertyList = propertyList.filter(p => p.isFavorite && p.status === 'for-sale').slice(0, 8);
  } else if (options.status) {
    if (options.status === 'on-show') {
      propertyList = propertyList.filter(p => p.onShow && p.status !== 'sold');
    } else {
      propertyList = propertyList.filter(p => p.status === options.status);
    }
  } else {
    propertyList = propertyList.filter(p => p.status !== 'sold');
  }

  return propertyList;
}

export async function getProperty(id: string): Promise<Property | null> {
  // First, try to get from local JSON for speed. This is a simple simulation.
  const property = properties.find(p => p.id.toString() === id);
  if (property) {
    return property as Property;
  }
  // Fallback to DB if not in local, though in this setup it should always be.
  return getPropertyFromDb(id);
}

// Agents
export async function getAgents(): Promise<Agent[]> {
  return agents as Agent[];
}

export async function getAgent(slug: string): Promise<Agent | null> {
  const agent = agents.find(a => a.slug === slug);
  return agent ? (agent as Agent) : null;
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
    const posts: BlogPost[] = blog.map(post => ({
        ...post,
        id: post.slug // Firestore might use a different ID, but slug is a good unique key
    }));
    return posts;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const post = blog.find(p => p.slug === slug);
  return post ? { ...post, id: slug } as BlogPost : null;
}
