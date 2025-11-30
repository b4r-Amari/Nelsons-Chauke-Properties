

import { type Property } from '@/components/shared/property-card';
import { type Agent } from '@/components/shared/agent-card';
import { type BlogPost } from '@/components/shared/blog-card';
import { collection, getDocs, doc, getDoc, query, where, limit, Timestamp } from 'firebase/firestore';
import type { DocumentData, DocumentSnapshot } from 'firebase/firestore';

// This is a temporary measure to allow server-side rendering in Next.js
// In a real-world scenario, you would use the Firebase Admin SDK for server-side operations
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "nc-properties-redefined",
  appId: "1:764533948711:web:477ded0be370b93290a902",
  apiKey: "AIzaSyB3VAQRiOwxSlLAGQxcwh-3QUd9zkG1zc8",
  authDomain: "nc-properties-redefined.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "764533948711",
  storageBucket: "nc-properties-redefined.appspot.com"
};

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}
const db = getFirestore(app);


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
  let q;
  const propertiesCol = collection(db, 'properties');

  if (options.featuredOnly) {
    q = query(propertiesCol, where('isFavorite', '==', true), where('status', '==', 'for-sale'), limit(8));
  } else if (options.status) {
    if (options.status === 'on-show') {
      q = query(propertiesCol, where('onShow', '==', true), where('status', '!=', 'sold'));
    } else {
      q = query(propertiesCol, where('status', '==', options.status));
    }
  } else {
     q = query(propertiesCol, where('status', '!=', 'sold'));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToObj) as Property[];
}

export async function getProperty(id: string): Promise<Property | null> {
  const propertyDoc = await getDoc(doc(db, 'properties', id));
  return propertyDoc.exists() ? docToObj(propertyDoc) as Property : null;
}

// Agents
export async function getAgents(): Promise<Agent[]> {
  const agentsCol = collection(db, 'agents');
  const snapshot = await getDocs(agentsCol);
  return snapshot.docs.map(docToObj) as Agent[];
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
    const blogCol = collection(db, 'blogPosts');
    const snapshot = await getDocs(blogCol);
    return snapshot.docs.map(docToObj) as BlogPost[];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const q = query(collection(db, 'blogPosts'), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
      return null;
  }
  return docToObj(snapshot.docs[0]) as BlogPost;
}
