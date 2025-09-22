
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCV3zOd1O9DIsCGy9455nfq90lrXNT8OnU",
  authDomain: "nelson-chauke-prop.firebaseapp.com",
  projectId: "nelson-chauke-prop",
  storageBucket: "nelson-chauke-prop.appspot.com",
  messagingSenderId: "423862286290",
  appId: "1:423862286290:web:ceb83c445f7064dcde3a0b",
  measurementId: "G-E8JCLL7NXH"
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const firebaseApp = app;
export const db: Firestore = getFirestore(app);
