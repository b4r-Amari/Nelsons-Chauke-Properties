
"use client";

import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/auth-context';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Poppins, Lato, Roboto } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // The admin layout handles its own html and body tags.
  // We only render the main layout for public-facing pages.
  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <html lang="en" className={cn("scroll-smooth", poppins.variable, lato.variable, roboto.variable)} suppressHydrationWarning>
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
