
"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./auth-context";

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (propertyId: string) => void;
  removeFromWishlist: (propertyId: string) => void;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const storageKey = user ? `wishlist_${user.uid}` : 'wishlist_guest';

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedWishlist = localStorage.getItem(storageKey);
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error("Failed to parse wishlist from localStorage", error);
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(storageKey, JSON.stringify(wishlist));
    }
  }, [wishlist, isLoading, storageKey]);


  const addToWishlist = (propertyId: string) => {
    if (!wishlist.includes(propertyId)) {
      setWishlist([...wishlist, propertyId]);
    }
  };

  const removeFromWishlist = (propertyId: string) => {
    setWishlist(wishlist.filter((id) => id !== propertyId));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
