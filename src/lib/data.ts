
import { type Property } from '@/components/shared/property-card';
import { type Agent } from '@/components/shared/agent-card';
import { type BlogPost } from '@/components/shared/blog-card';
import { getProperties as getPropertiesFromDb, getProperty as getPropertyFromDb, getAgents as getAgentsFromDb, getAgent as getAgentFromDb, getBlogPosts as getBlogPostsFromDb, getBlogPost as getBlogPostFromDb } from './firebase/firestore';


// Properties
export async function getProperties(options: { featuredOnly?: boolean } = {}): Promise<Property[]> {
  return getPropertiesFromDb(options);
}

export async function getProperty(id: string): Promise<Property | null> {
  return getPropertyFromDb(id);
}

// Agents
export async function getAgents(): Promise<Agent[]> {
  return getAgentsFromDb();
}

export async function getAgent(slug: string): Promise<Agent | null> {
  return getAgentFromDb(slug);
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
    return getBlogPostsFromDb();
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return getBlogPostFromDb(slug);
}
