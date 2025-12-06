

import { db } from './firebase/firebase';
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit, Timestamp } from "firebase/firestore";
import { Property } from '@/components/shared/property-card';
import { Agent } from '@/components/shared/agent-card';
import { BlogPost } from '@/components/shared/blog-card';

// Helper function to convert Firestore doc to a plain, serializable object
const docToObj = <T>(d: any): T & { id: string } => {
    const data = d.data();
    const serializableData: { [key: string]: any } = {};

    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (value instanceof Timestamp) {
                // Convert Firestore Timestamp to a serializable ISO string
                serializableData[key] = value.toDate().toISOString();
            } else {
                serializableData[key] = value;
            }
        }
    }

    return {
        ...serializableData,
        id: d.id, // Ensure the document ID is always included
    } as T & { id: string };
};


// Fetch all properties with optional filtering and sorting
export const getProperties = async (options: { featuredOnly?: boolean; status?: string; limit?: number, onShow?: boolean } = {}): Promise<Property[]> => {
    const propertiesCol = collection(db, 'properties');
    let q;

    // Use a more efficient 'in' query instead of '!='
    if (options.status) {
        q = query(propertiesCol, where('status', '==', options.status));
    } else {
        q = query(propertiesCol, where('status', 'in', ['for-sale', 'to-let']));
    }

    if (options.featuredOnly) {
        q = query(q, where('isFavorite', '==', true));
    }
     if (options.onShow) {
        q = query(q, where('onShow', '==', true));
    }
    if (options.limit) {
        q = query(q, limit(options.limit));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => docToObj<Property>(d));
};

// Fetch a single property by ID
export const getProperty = async (id: string): Promise<Property | null> => {
    const docRef = doc(db, 'properties', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToObj<Property>(docSnap) : null;
};

// Fetch all agents
export const getAgents = async (): Promise<Agent[]> => {
    const agentsCol = collection(db, 'estateAgents');
    const snapshot = await getDocs(agentsCol);
    return snapshot.docs.map(d => docToObj<Agent>(d));
};

// Fetch a single agent by their slug
export const getAgent = async (slug: string): Promise<Agent | null> => {
    const agentsQuery = query(collection(db, 'estateAgents'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(agentsQuery);
    if (snapshot.empty) {
        return null;
    }
    return docToObj<Agent>(snapshot.docs[0]);
};

// Fetch a single agent by their ID
export const getAgentById = async (id: string): Promise<Agent | null> => {
    const docRef = doc(db, 'estateAgents', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToObj<Agent>(docSnap) : null;
};


// Fetch all blog posts
export const getBlogPosts = async (options: { limit?: number } = {}): Promise<BlogPost[]> => {
    const postsCol = collection(db, 'blogPosts');
    let q = query(postsCol, orderBy('date', 'desc'));

    if (options.limit) {
        q = query(q, limit(options.limit));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = docToObj<BlogPost>(doc); // Use the serializing helper
        return {
            ...data,
            date: new Date(data.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        } as BlogPost;
    });
};

// Fetch a single blog post by its slug
export const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
    const postsQuery = query(collection(db, 'blogPosts'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(postsQuery);
    if (snapshot.empty) {
        return null;
    }
    const data = docToObj<BlogPost>(snapshot.docs[0]); // Use the serializing helper
    return {
        ...data,
        date: new Date(data.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
    } as BlogPost;
};

// Fetch a single blog post by its ID
export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
    const docRef = doc(db, 'blogPosts', id);
    const docSnap = await getDoc(docRef);
     if (!docSnap.exists()) {
        return null;
    }
    const data = docToObj<BlogPost>(docSnap); // Use the serializing helper
    return {
        ...data,
        date: new Date(data.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
    } as BlogPost;
};

// Fetch unique locations from all properties
export const getUniqueLocations = async (): Promise<string[]> => {
    const properties = await getProperties();
    const locations = properties.map(p => p.location);
    // Use a Set to get unique values and convert back to an array
    return [...new Set(locations)];
};
