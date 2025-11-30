
import * as admin from 'firebase-admin';

// Server-side (admin) app
if (admin.apps.length === 0) {
    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: process.env.GCLOUD_PROJECT || 'nc-properties-redefined',
        });
    } catch (error: any) {
        if (error.code !== 'app/duplicate-app') {
            console.error('Firebase Admin SDK initialization error:', error);
        }
    }
}

export const adminDb = admin.firestore();
