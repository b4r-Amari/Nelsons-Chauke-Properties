
import * as admin from 'firebase-admin';
import { CollectionReference, Timestamp } from 'firebase-admin/firestore';
import 'dotenv/config';

// Import data from JSON files
import propertiesData from '../../data/properties.json';
import agentsData from '../../data/agents.json';
import blogData from '../../data/blog.json';

// Initialize Firebase Admin SDK
// Make sure you have the GOOGLE_APPLICATION_CREDENTIALS environment variable set.
// This can be a path to your service account key file.
try {
    admin.initializeApp({
        projectId: process.env.GCLOUD_PROJECT || 'nc-properties-redefined',
    });
    console.log('Firebase Admin SDK initialized successfully.');
} catch (error: any) {
    if (error.code === 'app/duplicate-app') {
        console.warn('Firebase Admin SDK already initialized.');
    } else {
        console.error('Error initializing Firebase Admin SDK:', error);
        process.exit(1);
    }
}


const db = admin.firestore();

// Generic function to upload data to a collection
async function seedCollection<T extends { [key: string]: any }>(collection: CollectionReference, data: T[]) {
    console.log(`Checking if ${collection.id} collection is empty...`);
    const snapshot = await collection.limit(1).get();

    if (!snapshot.empty) {
        console.log(`Collection ${collection.id} is not empty. Skipping seed.`);
        return;
    }

    console.log(`Seeding ${collection.id} collection...`);
    const batch = db.batch();
    data.forEach((item) => {
        // Use a specific ID if it exists, otherwise let Firestore auto-generate one
        const docRef = item.id ? collection.doc(String(item.id)) : collection.doc();
        
        const dataWithTimestamp = {
            ...item,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        // Convert date strings to Timestamps for blog posts
        if (collection.id === 'blogPosts' && item.date) {
            dataWithTimestamp.date = Timestamp.fromDate(new Date(item.date));
        }

        batch.set(docRef, dataWithTimestamp);
    });

    try {
        await batch.commit();
        console.log(`Successfully seeded ${data.length} documents into ${collection.id}.`);
    } catch (error) {
        console.error(`Error seeding ${collection.id}:`, error);
    }
}

async function seedDatabase() {
    console.log('Starting database seed process...');
    
    // Seed Properties
    const propertiesCollection = db.collection('properties');
    await seedCollection(propertiesCollection, propertiesData);

    // Seed Agents
    const agentsCollection = db.collection('agents');
    await seedCollection(agentsCollection, agentsData);

    // Seed Blog Posts
    const blogPostsCollection = db.collection('blogPosts');
    await seedCollection(blogPostsCollection, blogData);

    console.log('Database seed process finished.');
    // The script will hang for a bit due to active Firestore connection, this is normal.
    // It will eventually exit.
}

seedDatabase().catch((error) => {
    console.error('An unexpected error occurred during seeding:', error);
});
