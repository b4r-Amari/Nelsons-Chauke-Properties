
"use client";

import type {Metadata} from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/auth-context';
import { WishlistProvider } from '@/context/wishlist-context';
import { usePathname } from 'next/navigation';

const metadata: Metadata = {
  title: 'NC Properties Redefined',
  description: 'Find your next home with NC Properties. We offer the best properties for sale and rent.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

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
      <body className="font-body antialiased text-foreground/90">
        <AuthProvider>
          <WishlistProvider>
            <div className="flex flex-col min-h-screen">
              {!isAdminPage && <Header />}
              <main className="flex-grow">
                {children}
              </main>
              {!isAdminPage && <Footer />}
            </div>
            <Toaster />
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
