
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { Poppins, Lato, Roboto } from 'next/font/google';
import MainLayout from '@/components/layout/main-layout'; // Import the new client component
import { cn } from '@/lib/utils';

// Font configuration
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

// SEO Metadata
export const metadata: Metadata = {
  // ... [Your existing metadata object]
};

// Root Layout (Server Component)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("scroll-smooth", poppins.variable, lato.variable, roboto.variable)} suppressHydrationWarning>
      <body className="font-body antialiased text-foreground/90">
        <AuthProvider>
            <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
