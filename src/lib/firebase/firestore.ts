
'use server';

import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

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
        revalidatePath('/admin/properties');
        revalidatePath('/properties');
        revalidatePath('/');
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
        revalidatePath(`/admin/properties`);
        revalidatePath(`/properties/${id}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteProperty(id: string) {
    try {
        await deleteDoc(doc(db, 'properties', id));
        revalidatePath('/admin/properties');
        revalidatePath('/properties');
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
        revalidatePath('/admin/agents');
        revalidatePath('/about-us');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteAgent(id: string) {
    try {
        await deleteDoc(doc(db, 'agents', id));
        revalidatePath('/admin/agents');
        revalidatePath('/about-us');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}


// Blog Posts
export async function addBlogPost(postData: DataObject) {
    try {
        // Create slug from title
        const slug = postData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        const blogCol = collection(db, 'blogPosts');
        await addDoc(blogCol, {
            ...postData,
            slug,
            date: Timestamp.fromDate(new Date()),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        revalidatePath('/admin/blogs');
        revalidatePath('/blog');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteBlogPost(id: string) {
    try {
        await deleteDoc(doc(db, 'blogPosts', id));
        revalidatePath('/admin/blogs');
        revalidatePath('/blog');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
