
'use client';

import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, Timestamp, setDoc, arrayUnion } from "firebase/firestore";

// Generic type for data to be added
type DataObject = { [key: string]: any };

// Properties
export async function addProperty(propertyData: DataObject) {
    try {
        const propertiesCol = collection(db, 'properties');
        await addDoc(propertiesCol, {
            ...propertyData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateProperty(id: string, propertyData: DataObject) {
    try {
        const propertyRef = doc(db, 'properties', id);
        await updateDoc(propertyRef, {
            ...propertyData,
            updatedAt: Timestamp.now(),
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteProperty(id: string) {
    try {
        await deleteDoc(doc(db, 'properties', id));
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Agents
export async function addAgent(agentData: DataObject) {
    try {
        // Create slug from name
        const slug = agentData.name.toLowerCase().replace(/\s+/g, '-');
        const agentsCol = collection(db, 'estateAgents');
        await addDoc(agentsCol, {
            ...agentData,
            slug,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateAgent(id: string, agentData: DataObject) {
    try {
        const slug = agentData.name.toLowerCase().replace(/\s+/g, '-');
        const agentRef = doc(db, 'estateAgents', id);
        await updateDoc(agentRef, {
            ...agentData,
            slug,
            updatedAt: Timestamp.now(),
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteAgent(id: string) {
    try {
        await deleteDoc(doc(db, 'estateAgents', id));
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}


// Blog Posts
export async function addBlogPost(blogData: DataObject) {
    try {
        const slug = blogData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        const blogCol = collection(db, 'blogPosts');
        await addDoc(blogCol, {
            ...blogData,
            slug,
            date: Timestamp.now(),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateBlogPost(id: string, blogData: DataObject) {
    try {
        const slug = blogData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        const blogRef = doc(db, 'blogPosts', id);
        await updateDoc(blogRef, {
            ...blogData,
            slug,
            updatedAt: Timestamp.now(),
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteBlogPost(id: string) {
    try {
        await deleteDoc(doc(db, 'blogPosts', id));
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Marketing & Leads
export async function addMarketingLead(data: { email: string, name?: string, source: string }) {
    try {
        const userRef = doc(db, 'users', data.email); // Use email as the document ID
        await setDoc(userRef, {
            email: data.email,
            name: data.name || '',
            sources: arrayUnion(data.source), // Add the new source to an array
            lastUpdatedAt: Timestamp.now()
        }, { merge: true }); // Merge to avoid overwriting existing data
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function addValuationRequest(data: DataObject) {
    try {
        const valuationCol = collection(db, 'valuationRequests');
        await addDoc(valuationCol, {
            ...data,
            createdAt: Timestamp.now(),
            status: 'new', // Initial status
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
