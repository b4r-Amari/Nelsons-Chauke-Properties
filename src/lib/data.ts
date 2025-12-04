
import { db } from './firebase/firebase';
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from "firebase/firestore";
import { Property } from '@/components/shared/property-card';
import { Agent } from '@/components/shared/agent-card';
import { BlogPost } from '@/components/shared/blog-card';

// Helper function to convert Firestore doc to a plain object
const docToObj = (d: any) => {
    const data = d.data();
    return {
        ...data,
        id: d.id, // Ensure the document ID is always included
    };
};

// Fetch all properties with optional filtering and sorting
export const getProperties = async (options: { featuredOnly?: boolean; status?: string; limit?: number } = {}): Promise<Property[]> => {
    const propertiesCol = collection(db, 'properties');
    let q = query(propertiesCol);

    if (options.featuredOnly) {
        q = query(q, where('isFavorite', '==', true));
    }
    if (options.status) {
        q = query(q, where('status', '==', options.status));
    }
    if (options.limit) {
        q = query(q, limit(options.limit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToObj) as Property[];
};

// Fetch a single property by ID
export const getProperty = async (id: string): Promise<Property | null> => {
    const docRef = doc(db, 'properties', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToObj(docSnap) as Property : null;
};

// Fetch all agents
export const getAgents = async (): Promise<Agent[]> => {
    const agentsCol = collection(db, 'estateAgents');
    const snapshot = await getDocs(agentsCol);
    return snapshot.docs.map(docToObj) as Agent[];
};

// Fetch a single agent by their slug
export const getAgent = async (slug: string): Promise<Agent | null> => {
    const agentsQuery = query(collection(db, 'estateAgents'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(agentsQuery);
    if (snapshot.empty) {
        return null;
    }
    return docToObj(snapshot.docs[0]) as Agent;
};

// Fetch a single agent by their ID
export const getAgentById = async (id: string): Promise<Agent | null> => {
    const docRef = doc(db, 'estateAgents', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docToObj(docSnap) as Agent : null;
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
        const data = doc.data();
        return {
            ...docToObj(doc),
            date: data.date.toDate().toLocaleDateString('en-US', {
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
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
        ...docToObj(doc),
        date: data.date.toDate().toLocaleDateString('en-US', {
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
    const data = docSnap.data();
    return {
        ...docToObj(docSnap),
        date: data.date.toDate().toLocaleDateString('en-US', {
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
