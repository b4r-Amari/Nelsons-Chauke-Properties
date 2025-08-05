
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#03132b] text-gray-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2">
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
            <h4 className="font-headline font-semibold text-white mb-4">Properties</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/properties" className="hover:text-white transition-colors">For Sale</Link></li>
              <li><Link href="/properties" className="hover:text-white transition-colors">For Rent</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">New Developments</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Commercial</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-headline font-semibold text-white mb-4">Follow Us</h4>
            <p className="text-sm text-gray-400 mb-4">Stay connected on social media for the latest updates and listings.</p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#1f2a36]/50">
        <div className="container py-4 text-sm flex flex-col md:flex-row justify-between items-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} NC Properties Redefined. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
