
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, query, where, orderBy, limit, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Property } from '@/components/shared/property-card';
import type { Agent } from '@/components/shared/agent-card';
import type { BlogPost } from '@/components/shared/blog-card';
import type { User } from './auth';

// Generic function to convert Firestore snapshot to array of objects
function snapshotToArray<T>(snapshot: any): T[] {
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as T));
}

// User role management
export async function addUserData(user: User) {
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    // Only create a new user document if one doesn't already exist.
    if (!docSnap.exists()) {
        try {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                role: 'customer', // Default role
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error creating user document:", error);
            // Optionally re-throw or handle the error as needed.
        }
    }
}


// Properties
export async function getProperties(options: { featuredOnly?: boolean } = {}): Promise<Property[]> {
  let q = collection(db, 'properties') as any;
  if (options.featuredOnly) {
    q = query(q, where('isFavorite', '==', true), where('status', '==', 'for-sale'), limit(8));
  } else {
    q = query(q, orderBy('id', 'desc'));
  }
  const snapshot = await getDocs(q);
  return snapshotToArray<Property>(snapshot);
}

export async function getProperty(id: string): Promise<Property | null> {
  const docRef = doc(db, 'properties', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Property;
  }
  return null;
}

export async function addProperty(property: Omit<Property, 'id'>) {
    return await addDoc(collection(db, 'properties'), {
        ...property,
        createdAt: serverTimestamp(),
    });
}

export async function updateProperty(id: string, property: Partial<Property>) {
    const docRef = doc(db, 'properties', id);
    return await updateDoc(docRef, property);
}

export async function deleteProperty(id: string) {
    const docRef = doc(db, 'properties', id);
    return await deleteDoc(docRef);
}

// Agents
export async function getAgents(): Promise<Agent[]> {
  const snapshot = await getDocs(collection(db, 'agents'));
  return snapshotToArray<Agent>(snapshot);
}

export async function getAgent(slug: string): Promise<Agent | null> {
  const q = query(collection(db, "agents"), where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Agent;
  }
  return null;
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  const q = query(collection(db, 'blogPosts'), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshotToArray<BlogPost>(snapshot);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const q = query(collection(db, "blogPosts"), where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as BlogPost;
  }
  return null;
}
