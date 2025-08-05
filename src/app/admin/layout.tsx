
import type { Metadata } from 'next';

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
    <html lang="en">
      <body>
          {children}
      </body>
    </html>
  );
}
