
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

export const auth = getAuth(firebaseApp);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  return userCredential;
};

export const signUp = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential;
};

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential;
};

export const logOut = () => {
  return signOut(auth);
};

export type { User };
