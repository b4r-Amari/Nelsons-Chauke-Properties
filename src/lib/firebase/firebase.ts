
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import * as admin from 'firebase-admin';

const firebaseConfig = {
  projectId: "nc-properties-redefined",
  appId: "1:764533948711:web:477ded0be370b93290a902",
  apiKey: "AIzaSyB3VAQRiOwxSlLAGQxcwh-3QUd9zkG1zc8",
  authDomain: "nc-properties-redefined.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "764533948711",
  storageBucket: "nc-properties-redefined.appspot.com"
};

// Client-side app
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const firebaseApp = app;
export const db: Firestore = getFirestore(app);


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
