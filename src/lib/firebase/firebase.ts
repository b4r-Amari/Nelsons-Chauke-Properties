import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

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