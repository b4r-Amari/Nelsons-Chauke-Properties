
import { type Property } from '@/components/shared/property-card';
import { type Agent } from '@/components/shared/agent-card';
import { type BlogPost } from '@/components/shared/blog-card';
import { adminDb } from './firebase/admin';
import * as admin from 'firebase-admin';

// Helper to convert Firestore document to a plain object
function docToObj(d: admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>) {
    const data = d.data();
    if (!data) return null;

    // Safely convert Firestore Timestamps to serializable strings
    const serializedData: { [key: string]: any } = {};
    for (const key in data) {
        const value = data[key];
        if (value instanceof admin.firestore.Timestamp) {
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
        ...serializedData,
        id: d.id,
    };
}


// Properties
export async function getProperties(options: { featuredOnly?: boolean; status?: 'on-show' | 'sold' } = {}): Promise<Property[]> {
  const propertiesCol = adminDb.collection('properties');
  let q: admin.firestore.Query;

  if (options.featuredOnly) {
    q = propertiesCol.where('isFavorite', '==', true).where('status', '==', 'for-sale').limit(8);
  } else if (options.status) {
    if (options.status === 'on-show') {
        q = propertiesCol.where('onShow', '==', true).where('status', '!=', 'sold');
    } else {
        q = propertiesCol.where('status', '==', options.status);
    }
  } else {
     q = propertiesCol.where('status', '!=', 'sold');
  }

  const snapshot = await q.get();
  return snapshot.docs.map(docToObj) as Property[];
}

export async function getProperty(id: string): Promise<Property | null> {
  const propertyDoc = await adminDb.collection('properties').doc(id).get();
  return propertyDoc.exists ? docToObj(propertyDoc) as Property : null;
}

// Agents
export async function getAgents(): Promise<Agent[]> {
  const agentsCol = adminDb.collection('agents');
  const snapshot = await agentsCol.get();
  return snapshot.docs.map(docToObj) as Agent[];
}

export async function getAgent(slug: string): Promise<Agent | null> {
  const q = adminDb.collection('agents').where('slug', '==', slug).limit(1);
  const snapshot = await q.get();
  if (snapshot.empty) {
    return null;
  }
  return docToObj(snapshot.docs[0]) as Agent;
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
    const blogCol = adminDb.collection('blogPosts');
    const snapshot = await blogCol.get();
    return snapshot.docs.map(docToObj) as BlogPost[];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const q = adminDb.collection('blogPosts').where('slug', '==', slug).limit(1);
  const snapshot = await q.get();
  if (snapshot.empty) {
      return null;
  }
  return docToObj(snapshot.docs[0]) as BlogPost;
}
