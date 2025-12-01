
"use client";

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close the mobile menu when the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Add/remove a class to the body to prevent scrolling when the mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    // Cleanup function to remove the class if the component unmounts
    return () => {
        document.body.classList.remove('overflow-hidden');
    };
  }, [mobileMenuOpen]);

  // The admin layout has its own structure, so we don't render the main layout for it.
  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
        <div className="flex flex-col min-h-screen">
            <Header setMobileMenuOpen={setMobileMenuOpen} />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
        <Toaster />
    </>
  );
}
