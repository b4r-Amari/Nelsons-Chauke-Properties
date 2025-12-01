
import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#03132b] text-gray-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2 col-span-full sm:col-span-2">
            <Logo className="text-white" />
            <p className="mt-4 text-sm text-gray-400 max-w-xs">Your trusted partner in finding the perfect property. We are committed to excellence and customer satisfaction.</p>
          </div>
          
          <div>
            <h4 className="font-headline font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-headline font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/properties?status=for-sale" className="hover:text-white transition-colors">For Sale</Link></li>
              <li><Link href="/properties?status=to-let" className="hover:text-white transition-colors">To Let</Link></li>
              <li><Link href="/sell" className="hover:text-white transition-colors">Sell a Property</Link></li>
              <li><Link href="/calculators" className="hover:text-white transition-colors">Calculators</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 col-span-full sm:col-span-2">
            <h4 className="font-headline font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter for the latest property news and updates.</p>
            {/* Newsletter Form would go here */}
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} NC Properties. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
