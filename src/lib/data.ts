
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
  } else if (options.status) {
    if (options.status === 'on-show') {
      q = query(propertiesCol, where('onShow', '==', true));
      const snapshot = await getDocs(q);
      const properties = snapshot.docs.map(docToObj).filter(p => p && p.status !== 'sold') as Property[];
      console.log(`Successfully connected to Firebase. Fetched ${properties.length} 'on-show' properties.`);
      return properties;
    } else { // 'sold'
      q = query(propertiesCol, where('status', '==', options.status));
    }
  } else {
     // Default query for all properties (e.g., for the main dashboard count)
     q = query(propertiesCol);
  }

  const snapshot = await getDocs(q);
  const properties = snapshot.docs.map(docToObj) as Property[];
  console.log(`Successfully connected to Firebase. Fetched ${properties.length} properties.`);
  
  // If no specific status is requested, and it's not a featured query, filter out 'sold' properties for general listing pages
  if (!options.status && !options.featuredOnly) {
    return properties.filter(p => p.status !== 'sold');
  }

  // For the dashboard (no options), return all properties.
  if (Object.keys(options).length === 0) {
      return properties;
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
  const agentsCol = collection(db, 'agents');
  const snapshot = await getDocs(agentsCol);
  const agents = snapshot.docs.map(docToObj) as Agent[];
  console.log(`Successfully connected to Firebase. Fetched ${agents.length} agents.`);
  return agents;
}

export async function getAgent(slug: string): Promise<Agent | null> {
  const q = query(collection(db, 'agents'), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  return docToObj(snapshot.docs[0]) as Agent;
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
    console.log('Attempting to fetch blog posts from Firestore...');
    const blogCol = collection(db, 'blogPosts');
    const snapshot = await getDocs(blogCol);
    const posts = snapshot.docs.map(docToObj) as BlogPost[];
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
