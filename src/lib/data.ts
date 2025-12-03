
import { type Property } from '@/components/shared/property-card';
import { type Agent } from '@/components/shared/agent-card';
import { type BlogPost } from '@/components/shared/blog-card';
import { collection, getDocs, doc, getDoc, query, where, limit, Timestamp } from 'firebase/firestore';
import type { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { db } from './firebase/firebase';


// Helper to convert Firestore document to a plain object
function docToObj(d: DocumentSnapshot<DocumentData>) {
    const data = d.data();
    if (!data) return null;

    // Safely convert Firestore Timestamps to serializable strings
    const serializedData: { [key: string]: any } = {};
    for (const key in data) {
        const value = data[key];
        if (value instanceof Timestamp) {
            if (key === 'date') { // For blog posts
                 serializedData[key] = value.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            } else { // for createdAt, updatedAt
                serializedData[key] = value.toDate().toISOString();
            }
        } else {
            serializedData[key] = value;
        }
    }

    return {
        id: d.id, // Ensure the document ID is always assigned
        ...serializedData,
    };
}


// Properties
export async function getProperties(options: { featuredOnly?: boolean; status?: 'on-show' | 'sold' } = {}): Promise<Property[]> {
  console.log('Attempting to fetch properties from Firestore...');
  let q;
  const propertiesCol = collection(db, 'properties');

  if (options.featuredOnly) {
    q = query(propertiesCol, where('isFavorite', '==', true), where('status', '==', 'for-sale'), limit(8));
  } else if (options.status === 'on-show') {
    q = query(propertiesCol, where('onShow', '==', true));
    const snapshot = await getDocs(q);
    const properties = snapshot.docs.map(docToObj).filter(p => p !== null) as Property[];
    const onShowProperties = properties.filter(p => p.status !== 'sold');
    console.log(`Successfully connected to Firebase. Fetched ${onShowProperties.length} 'on-show' properties.`);
    return onShowProperties;
  } else if (options.status === 'sold') {
    q = query(propertiesCol, where('status', '==', 'sold'));
  } else {
     // Default query for all properties (e.g., for the main dashboard count)
     q = query(propertiesCol);
  }

  const snapshot = await getDocs(q);
  const properties = snapshot.docs.map(docToObj).filter(p => p !== null) as Property[];
  console.log(`Successfully connected to Firebase. Fetched ${properties.length} properties.`);
  
  // If no specific options are provided, return all properties.
  if (Object.keys(options).length === 0) {
      return properties;
  }
  
  // For general listing pages, filter out sold properties unless specifically requested
  if (!options.status) {
      return properties.filter(p => p.status !== 'sold');
  }
  
  return properties;
}


export async function getProperty(id: string): Promise<Property | null> {
  const propertyDoc = await getDoc(doc(db, 'properties', id));
  return propertyDoc.exists() ? docToObj(propertyDoc) as Property : null;
}

// Agents
export async function getAgents(): Promise<Agent[]> {
  console.log('Attempting to fetch agents from Firestore...');
  const agentsCol = collection(db, 'estateAgents');
  const snapshot = await getDocs(agentsCol);
  const agents = snapshot.docs.map(docToObj).filter(Boolean) as Agent[];
  console.log(`Successfully connected to Firebase. Fetched ${agents.length} agents.`);
  return agents;
}

export async function getAgent(slug: string): Promise<Agent | null> {
  const q = query(collection(db, 'estateAgents'), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  return docToObj(snapshot.docs[0]) as Agent;
}

export async function getAgentById(id: string): Promise<Agent | null> {
    const agentDoc = await getDoc(doc(db, 'estateAgents', id));
    return agentDoc.exists() ? docToObj(agentDoc) as Agent : null;
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
    console.log('Attempting to fetch blog posts from Firestore...');
    const blogCol = collection(db, 'blogPosts');
    const snapshot = await getDocs(blogCol);
    const posts = snapshot.docs.map(docToObj).filter(Boolean) as BlogPost[];
    console.log(`Successfully connected to Firebase. Fetched ${posts.length} blog posts.`);
    return posts;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const q = query(collection(db, 'blogPosts'), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
      return null;
  }
  return docToObj(snapshot.docs[0]) as BlogPost;
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
    const blogDoc = await getDoc(doc(db, 'blogPosts', id));
    return blogDoc.exists() ? docToObj(blogDoc) as BlogPost : null;
}
