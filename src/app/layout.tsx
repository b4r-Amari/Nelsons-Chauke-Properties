
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { Poppins, Lato, Roboto } from 'next/font/google';
import MainLayout from '@/components/layout/main-layout';
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
  title: {
    default: 'Nelson Chauke Properties',
    template: '%s | NC Properties',
  },
  description: 'Your trusted partner in finding the perfect property. Search homes for sale and rent, connect with expert agents, and discover your dream home with Nelson Chauke Properties.',
  keywords: ['real estate', 'property', 'homes for sale', 'to-let', 'buy property', 'rent property', 'South Africa real estate', 'Nelson Chauke'],
  authors: [{ name: 'Nelson Chauke Properties', url: 'https://nc-properties.vercel.app' }],
  creator: 'Nelson Chauke',
  publisher: 'Nelson Chauke Properties',
  metadataBase: new URL('https://nc-properties.vercel.app'),
  openGraph: {
    title: 'Nelson Chauke Properties | Your Trusted Property Partner',
    description: 'Find your dream home with our expert real estate services. Browse listings, get market insights, and connect with top agents.',
    url: 'https://nc-properties.vercel.app',
    siteName: 'NC Properties',
    images: [
      {
        url: 'https://nc-properties.vercel.app/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'A beautiful property managed by NC Properties',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NC Properties | Premier Property Listings',
    description: 'Discover homes for sale, apartments for rent, and connect with the best real estate agents in the market.',
    images: ['https://nc-properties.vercel.app/images/twitter-og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

// Viewport Configuration
export const viewport: Viewport = {
  themeColor: '#ffffff',
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
