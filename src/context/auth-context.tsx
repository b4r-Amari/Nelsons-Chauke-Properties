
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
        console.log(`[Auth Check] Checking for admin status with UID: ${userId}`);
        const adminDocRef = doc(db, "adminUsers", userId);
        const adminDoc = await getDoc(adminDocRef);
        
        if (adminDoc.exists()) {
            console.log(`[Auth Check] SUCCESS: Admin document found for UID: ${userId}`);
            return true;
        } else {
            console.log(`[Auth Check] FAILURE: No admin document found at path: /adminUsers/${userId}`);
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
    console.log('[Auth Provider] Setting up Firebase auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true); 
      
      if (user) {
        console.log(`[Auth State] User logged in with UID: ${user.uid}`);
        setUser(user);
        const userIsAdmin = await checkIsAdmin(user.uid);
        setIsAdmin(userIsAdmin);
        console.log(`[Auth State] Final admin status set to: ${userIsAdmin}`);

        if (userIsAdmin) {
            if (pathname === '/admin/login') {
                console.log('[Redirect] Admin on login page, redirecting to dashboard...');
                router.replace('/admin/dashboard');
            }
        } else {
            if (pathname.startsWith('/admin')) {
                console.log('[Redirect] Non-admin attempting to access admin route, redirecting to home...');
                router.replace('/');
            }
        }
      } else {
        console.log('[Auth State] No user logged in.');
        setUser(null);
        setIsAdmin(false);
         if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
            console.log('[Redirect] Logged out user on admin page, redirecting to login...');
            router.replace('/admin/login');
         }
      }
      setIsLoading(false); 
      console.log('[Auth Provider] Finished processing auth state change.');
    });

    return () => {
        console.log('[Auth Provider] Cleaning up auth state listener.');
        unsubscribe();
    }
  }, [pathname, router]);

  const isProtectedAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  if (isLoading && isProtectedAdminRoute) {
    console.log("[Render Block] Loading and on a protected route. Rendering null.");
    return null; // Or a full-page loader
  }
  
  if (!isLoading && !isAdmin && isProtectedAdminRoute) {
    console.log("[Render Block] Not an admin and on a protected route. Rendering null to prevent content flash.");
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
