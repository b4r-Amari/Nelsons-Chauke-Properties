'use client';

import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, Timestamp, setDoc, arrayUnion, getDoc } from "firebase/firestore";

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
    console.log("3. updateProperty function started with id:", id);
    try {
        const propertyRef = doc(db, 'properties', id);
        const dataToUpdate = { ...propertyData };
        delete (dataToUpdate as { id?: string }).id;
        const dataToUpdateWithTimestamp = {
            ...dataToUpdate,
            updatedAt: Timestamp.now(),
        };

        console.log("4. Attempting to update document with data:", dataToUpdateWithTimestamp);
        await updateDoc(propertyRef, dataToUpdateWithTimestamp);
        console.log("5. Document successfully updated.");

        return { success: true };
    } catch (error: any) {
        console.error("6. Error updating property in firestore.ts:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteProperty(id: string) {
    try {
        const docRef = doc(db, 'properties', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return { success: false, error: "Property does not exist." };
        }
        await deleteDoc(docRef);
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
        const dataToUpdate = { ...agentData };
        delete (dataToUpdate as { id?: string }).id;
        await updateDoc(agentRef, {
            ...dataToUpdate,
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
        const docRef = doc(db, 'estateAgents', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return { success: false, error: "Agent does not exist." };
        }
        await deleteDoc(docRef);
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
        const dataToUpdate = { ...blogData };
        delete (dataToUpdate as { id?: string }).id;
        await updateDoc(blogRef, {
            ...dataToUpdate,
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
        const docRef = doc(db, 'blogPosts', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return { success: false, error: "Blog post does not exist." };
        }
        await deleteDoc(docRef);
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
