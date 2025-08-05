
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  projectId: "nc-properties-redefined",
  appId: "1:764533948711:web:477ded0be370b93290a902",
  storageBucket: "nc-properties-redefined.firebasestorage.app",
  apiKey: "AIzaSyB3VAQRiOwxSlLAGQxcwh-3QUd9zkG1zc8",
  authDomain: "nc-properties-redefined.firebaseapp.com",
  messagingSenderId: "764533948711",
};

function initializeFirebase() {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
}

export const firebaseApp = initializeFirebase();
