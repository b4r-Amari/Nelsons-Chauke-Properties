
'use server';

import { adminDb } from './firebase';
import { Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

// Generic type for data to be added
type DataObject = { [key: string]: any };

// Properties
export async function addProperty(propertyData: DataObject) {
    try {
        const propertiesCol = adminDb.collection('properties');
        await propertiesCol.add({
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
        const propertyRef = adminDb.collection('properties').doc(id);
        await propertyRef.update({
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
        await adminDb.collection('properties').doc(id).delete();
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
        const agentsCol = adminDb.collection('agents');
        await agentsCol.add({
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
        await adminDb.collection('agents').doc(id).delete();
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
        const blogCol = adminDb.collection('blogPosts');
        await blogCol.add({
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
        await adminDb.collection('blogPosts').doc(id).delete();
        revalidatePath('/admin/blogs');
        revalidatePath('/blog');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
