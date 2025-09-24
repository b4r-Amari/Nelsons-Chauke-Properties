
"use client";

import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/auth-context';
import { usePathname } from 'next/navigation';
import { useState, Suspense } from 'react';
import { cn } from '@/lib/utils';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isAdminPage) {
    return <>{children}</>;
  }
  
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn(
        "font-body antialiased text-foreground/90",
        mobileMenuOpen && "overflow-hidden"
      )}>
        <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header setMobileMenuOpen={setMobileMenuOpen} />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  )
}
