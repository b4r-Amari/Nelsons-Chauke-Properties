
'use client';

import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";

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
        const agentsCol = collection(db, 'agents');
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

export async function deleteAgent(id: string) {
    try {
        await deleteDoc(doc(db, 'agents', id));
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

export async function deleteBlogPost(id: string) {
    try {
        await deleteDoc(doc(db, 'blogPosts', id));
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
