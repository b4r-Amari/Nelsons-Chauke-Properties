
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
        return false;
    }
    try {
        const adminDocRef = doc(db, "adminUsers", userId);
        const adminDoc = await getDoc(adminDocRef);
        
        return adminDoc.exists();
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true); 
      
      if (user) {
        setUser(user);
        const userIsAdmin = await checkIsAdmin(user.uid);
        setIsAdmin(userIsAdmin);

        if (userIsAdmin) {
            if (pathname === '/admin/login') {
                router.replace('/admin/dashboard');
            }
        } else {
            if (pathname.startsWith('/admin')) {
                router.replace('/');
            }
        }
      } else {
        setUser(null);
        setIsAdmin(false);
         if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
            router.replace('/admin/login');
         }
      }
      setIsLoading(false); 
    });

    return () => {
        unsubscribe();
    }
  }, [pathname, router]);

  const isProtectedAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  if (isLoading && isProtectedAdminRoute) {
    return null; // Or a full-page loader
  }
  
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
