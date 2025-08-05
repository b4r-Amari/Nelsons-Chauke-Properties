
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/auth-context';
import { WishlistProvider } from '@/context/wishlist-context';
import { Toaster } from '@/components/ui/toaster';
import { AdminSidebar } from '@/components/layout/admin-sidebar';

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
         <div className="flex min-h-screen bg-muted/40">
           <AdminSidebar />
            <main className="flex-1 p-8">
              {children}
            </main>
         </div>
        <Toaster />
      </WishlistProvider>
    </AuthProvider>
  );
}
