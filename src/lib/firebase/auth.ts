
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

// Function to create a user document in Firestore in the 'users' collection
const createUserProfileDocument = async (user: User) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    // Create a profile for every new user, which can be used for marketing lists etc.
    if (!snapshot.exists()) {
        const { email, uid, displayName, photoURL } = user;
        const createdAt = serverTimestamp();
        try {
            await setDoc(userRef, {
                uid,
                email,
                displayName,
                photoURL,
                createdAt,
            });
        } catch (error) {
            console.error("Error creating user profile", error);
        }
    }
};


export const signInWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  await createUserProfileDocument(userCredential.user);
  return userCredential;
};

export const signUp = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await createUserProfileDocument(userCredential.user);
  return userCredential;
};

export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
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
