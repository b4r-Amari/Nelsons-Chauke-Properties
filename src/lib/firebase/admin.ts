
import * as admin from 'firebase-admin';

// In a Google Cloud environment like App Hosting, the SDK will automatically
// find the service account credentials. We don't need to provide them.
if (admin.apps.length === 0) {
    try {
        admin.initializeApp();
    } catch (error: any) {
        if (error.code !== 'app/duplicate-app') {
            console.error('Firebase Admin SDK initialization error:', error);
        }
    }
}

export const adminDb = admin.firestore();
