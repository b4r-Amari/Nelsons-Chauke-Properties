
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCV3zOd1O9DIsCGy9455nfq90lrXNT8OnU",
  authDomain: "nelson-chauke-prop.firebaseapp.com",
  projectId: "nelson-chauke-prop",
  storageBucket: "nelson-chauke-prop.firebasestorage.app",
  messagingSenderId: "423862286290",
  appId: "1:423862286290:web:ceb83c445f7064dcde3a0b",
  measurementId: "G-E8JCLL7NXH"
};

function initializeFirebase() {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
}

export const firebaseApp = initializeFirebase();
