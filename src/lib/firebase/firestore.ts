
"use client"

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
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
        }
    }
}

// SINGLE DOCUMENT FETCH FUNCTIONS
export async function getProperty(id: string): Promise<Property | null> {
    try {
        const docRef = doc(db, "properties", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as unknown as Property;
        } else {
            console.log("No such property document in Firestore!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching property from Firestore:", error);
        return null;
    }
}

export async function getAgent(slug: string): Promise<Agent | null> {
    try {
        const q = query(collection(db, "agents"), where("slug", "==", slug));
        const querySnapshot = await getDoc(q.docs[0].ref);
        if (querySnapshot.exists()) {
            const doc = querySnapshot;
            return { id: doc.id, ...doc.data() } as unknown as Agent;
        }
        return null;
    } catch (error) {
        console.error("Error fetching agent by slug from Firestore:", error);
        return null;
    }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
        const q = query(collection(db, "blogPosts"), where("slug", "==", slug));
        const querySnapshot = await getDoc(q.docs[0].ref);
        if (querySnapshot.exists()) {
            const doc = querySnapshot;
            return { id: doc.id, ...doc.data() } as unknown as BlogPost;
        }
        return null;
    } catch (error) {
        console.error("Error fetching blog post by slug from Firestore:", error);
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
