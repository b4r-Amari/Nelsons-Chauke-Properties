
"use client";

import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User
} from "firebase/auth";
import { firebaseApp } from "./firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"; 
import { db } from "./firebase";

export const auth = getAuth(firebaseApp);

const googleProvider = new GoogleAuthProvider();

// Function to check if a user is an admin
const checkIsAdmin = async (userId: string): Promise<boolean> => {
    if (!userId) return false;
    const adminDocRef = doc(db, "adminUsers", userId);
    const adminDoc = await getDoc(adminDocRef);
    return adminDoc.exists();
};


// Function to create/update a user document in Firestore in the 'users' collection
const createUserProfileDocument = async (user: User) => {
    if (!user) return;
    
    const userRef = doc(db, "users", user.uid);
    
    try {
        const userIsAdmin = await checkIsAdmin(user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            // New user, create profile
            const { email, uid, displayName, photoURL } = user;
            const createdAt = serverTimestamp();
            await setDoc(userRef, {
                uid,
                email,
                displayName,
                photoURL,
                createdAt,
                isAdmin: userIsAdmin,
            });
        } else {
            // Existing user, update admin status if necessary
            if (userSnapshot.data()?.isAdmin !== userIsAdmin) {
                await setDoc(userRef, { isAdmin: userIsAdmin }, { merge: true });
            }
        }
    } catch (error) {
        console.error("Error creating or updating user profile", error);
    }
};


export const signInWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  await createUserProfileDocument(userCredential.user);
  return userCredential;
};

export const signUp = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // This will create a standard user profile. Admin must be designated separately.
  await createUserProfileDocument(userCredential.user);
  return userCredential;
};

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  // On sign-in, check and update their admin status on their user profile
  await createUserProfileDocument(userCredential.user);
  return userCredential;
};

export const logOut = () => {
  return signOut(auth);
};

// Monitor auth state to create user profiles
onAuthStateChanged(auth, (user) => {
    if (user) {
        createUserProfileDocument(user);
    }
})

export type { User };
