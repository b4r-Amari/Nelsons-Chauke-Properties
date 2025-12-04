
"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, type User } from "@/lib/firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { usePathname, useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to check if a user is an admin by checking for a document with their UID as the ID
const checkIsAdmin = async (userId: string): Promise<boolean> => {
    if (!userId) {
        console.log("[Auth Check] No user ID provided, cannot be an admin.");
        return false;
    }
    try {
        const adminDocRef = doc(db, "adminUsers", userId);
        console.log(`[Auth Check] Checking for admin document at path: adminUsers/${userId}`);

        const adminDoc = await getDoc(adminDocRef);
        
        if (adminDoc.exists()) {
            console.log("[Auth Check] SUCCESS: Admin document found. User is an admin.");
            return true;
        } else {
            console.log("[Auth Check] FAILURE: Admin document not found. User is NOT an admin.");
            return false;
        }
    } catch (error) {
        console.error("[Auth Check] Error checking admin status:", error);
        return false;
    }
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("[Auth Provider] Initializing authentication listener...");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("[Auth Provider] Auth state changed.");
      setIsLoading(true); 
      
      if (user) {
        console.log(`[Auth Provider] User is logged in. UID: ${user.uid}`);
        setUser(user);
        const userIsAdmin = await checkIsAdmin(user.uid);
        setIsAdmin(userIsAdmin);
        console.log(`[Auth Provider] Final admin status set to: ${userIsAdmin}`);

        // If user is not an admin but trying to access admin pages (not login)
        if (!userIsAdmin && pathname.startsWith('/admin') && pathname !== '/admin/login') {
          console.log("[Auth Provider] Redirecting non-admin from admin area.");
          router.replace('/');
        } else if (userIsAdmin && pathname === '/admin/login') {
            console.log("[Auth Provider] Redirecting logged-in admin from login page to dashboard.");
            router.replace('/admin/dashboard');
        }
      } else {
        // No user is logged in
        console.log("[Auth Provider] No user is logged in.");
        setUser(null);
        setIsAdmin(false);
        // If not logged in, redirect any attempts to access admin pages away from login
         if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
            console.log("[Auth Provider] Redirecting non-authenticated user to login page.");
            router.replace('/admin/login');
         }
      }
      console.log("[Auth Provider] Auth processing finished.");
      setIsLoading(false); // End loading state
    });

    return () => {
      console.log("[Auth Provider] Cleaning up authentication listener.");
      unsubscribe();
    }
  }, [pathname, router]);

  // While loading, or if unauthorized on an admin page, don't render children
  const isProtectedAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  if (isLoading && isProtectedAdminRoute) {
    return null; // Or return a full-page loader
  }
  
  // After loading, if user is not admin and on a protected route, they will be redirected by the effect.
  // Returning null here prevents flashing the content.
  if (!isLoading && !isAdmin && isProtectedAdminRoute) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
