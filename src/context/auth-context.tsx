
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().isAdmin === true) {
          setIsAdmin(true);
          // If user is admin and trying to access a non-admin page, redirect them.
          // This is a basic example; more complex logic might be needed.
          if (!pathname.startsWith('/admin')) {
             // router.push('/admin/dashboard');
          }
        } else {
          setIsAdmin(false);
          // If a non-admin user tries to access an admin page, redirect them.
          if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
            router.replace('/');
          }
        }
      } else {
        setIsAdmin(false);
        // If not logged in, redirect any attempts to access admin pages away.
         if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
            router.replace('/admin/login');
         }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [pathname, router]);

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
