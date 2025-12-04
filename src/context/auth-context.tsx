
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
    if (!userId) return false;
    const adminDocRef = doc(db, "adminUsers", userId);
    const adminDoc = await getDoc(adminDocRef);
    return adminDoc.exists();
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true); // Start loading state
      setUser(user);
      if (user) {
        const userIsAdmin = await checkIsAdmin(user.uid);
        setIsAdmin(userIsAdmin);

        // If user is not an admin but trying to access admin pages (not login)
        if (!userIsAdmin && pathname.startsWith('/admin') && pathname !== '/admin/login') {
          router.replace('/');
        }
      } else {
        // No user is logged in
        setIsAdmin(false);
        // If not logged in, redirect any attempts to access admin pages away from login
         if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
            router.replace('/admin/login');
         }
      }
      setIsLoading(false); // End loading state
    });
    return () => unsubscribe();
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
