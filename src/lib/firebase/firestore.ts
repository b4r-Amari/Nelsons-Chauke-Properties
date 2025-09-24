
"use client"

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  type DocumentData,
  type Firestore,
} from "firebase/firestore";
import { firebaseApp } from "./firebase";
import { type Property } from '@/components/shared/property-card';
import { type Agent } from '@/components/shared/agent-card';
import { type BlogPost } from '@/components/shared/blog-card';
import type { User } from "./auth";

export const db: Firestore = getFirestore(firebaseApp);

// USER-RELATED FUNCTIONS
export async function addUserData(user: User) {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        try {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                wishlist: [],
                createdAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Error creating user document:", error);
            // We don't re-throw the error, to allow login/signup to complete
        }
    }
}

// PROPERTY-RELATED FUNCTIONS
export async function getProperties(options: { featuredOnly?: boolean; status?: 'on-show' | 'sold' } = {}): Promise<Property[]> {
  try {
    let q = query(collection(db, "properties"));
    
    if (options.featuredOnly) {
      q = query(q, where("isFavorite", "==", true), where("status", "==", "for-sale"));
    } else if (options.status) {
       if (options.status === 'on-show') {
          q = query(q, where("onShow", "==", true), where("status", "!=", "sold"));
       } else {
         q = query(q, where("status", "==", options.status));
       }
    } else {
       q = query(q, where("status", "!=", "sold"));
    }

    const querySnapshot = await getDocs(q);
    const properties = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Property));

    if (options.featuredOnly) {
        return properties.slice(0, 8);
    }
    
    return properties;
  } catch (error) {
    console.error("Error fetching properties from Firestore:", error);
    return [];
  }
}

export async function getProperty(id: string): Promise<Property | null> {
    try {
        const docRef = doc(db, "properties", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as unknown as Property;
        } else {
            console.log("No such property document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching property:", error);
        return null;
    }
}

// AGENT-RELATED FUNCTIONS
export async function getAgents(): Promise<Agent[]> {
    try {
        const querySnapshot = await getDocs(collection(db, "agents"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Agent));
    } catch (error) {
        console.error("Error fetching agents:", error);
        return [];
    }
}

export async function getAgent(slug: string): Promise<Agent | null> {
    try {
        const q = query(collection(db, "agents"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as unknown as Agent;
        }
        return null;
    } catch (error) {
        console.error("Error fetching agent by slug:", error);
        return null;
    }
}


// BLOG-RELATED FUNCTIONS
export async function getBlogPosts(): Promise<BlogPost[]> {
    try {
        const querySnapshot = await getDocs(collection(db, "blogPosts"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as BlogPost));
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return [];
    }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
        const q = query(collection(db, "blogPosts"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as unknown as BlogPost;
        }
        return null;
    } catch (error) {
        console.error("Error fetching blog post by slug:", error);
        return null;
    }
}


// FORM SUBMISSION FUNCTIONS
export async function addContactSubmission(data: any) {
  try {
    const docRef = await addDoc(collection(db, "contactSubmissions"), {
      ...data,
      submittedAt: new Date().toISOString(),
    });
    console.log("Contact submission written with ID: ", docRef.id);
    return docRef;
  } catch (e) {
    console.error("Error adding contact submission: ", e);
    throw e;
  }
}

export async function addEnquiry(data: any) {
  try {
    const docRef = await addDoc(collection(db, "enquiries"), {
      ...data,
      submittedAt: new Date().toISOString(),
    });
    console.log("Enquiry written with ID: ", docRef.id);
    return docRef;
  } catch (e) {
    console.error("Error adding enquiry: ", e);
    throw e;
  }
}

export async function addValuationRequest(data: any) {
  try {
    const docRef = await addDoc(collection(db, "valuationRequests"), {
      ...data,
      submittedAt: new Date().toISOString(),
    });
    console.log("Valuation request written with ID: ", docRef.id);
    return docRef;
  } catch (e) {
    console.error("Error adding valuation request: ", e);
    throw e;
  }
}
