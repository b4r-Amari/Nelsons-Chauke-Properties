
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/auth-context';
import { WishlistProvider } from '@/context/wishlist-context';
import { Toaster } from '@/components/ui/toaster';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { ThemeProvider } from '@/context/theme-provider';

export const metadata: Metadata = {
  title: 'Admin - NC Properties',
  description: 'Admin portal for NC Properties.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen w-full">
            <AdminSidebar />
            {/* The main content needs a margin-left equal to the sidebar width */}
            <main className="flex-1 flex-col p-4 sm:p-6 md:p-8 md:ml-[220px] lg:ml-[280px]">
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
