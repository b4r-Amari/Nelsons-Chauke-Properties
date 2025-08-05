
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, Heart, User, X, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
  { href: "/", label: "Home" },
  { 
    label: "Properties",
    isDropdown: true,
    links: [
      { href: "/properties", label: "Buy" },
      { href: "/sell", label: "Sell" },
      { href: "/properties/sold", label: "Sold" },
      { href: "/properties/on-show", label: "On Show" },
    ]
  },
  { href: "/blog", label: "Property News" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
];

const mobileNavLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/properties/sold", label: "Sold" },
  { href: "/properties/on-show", label: "On Show" },
  { href: "/blog", label: "Property News" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
]


export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isPropertiesActive = pathname.startsWith('/properties') || pathname === '/sell';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center">
          <Logo />
        </div>
        
        <div className="hidden md:flex flex-1 justify-center items-center">
          <nav className="flex items-center space-x-1 text-sm font-medium font-headline">
            {navLinks.map((item) => (
              item.isDropdown && item.links ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={cn(
                      "group relative px-3 py-2 text-sm font-medium font-headline transition-colors hover:bg-transparent",
                      isPropertiesActive ? "text-primary" : "text-muted-foreground hover:text-brand-bright",
                      "focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                      )}>
                      <span>{item.label}</span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      <span className={cn(
                        'absolute bottom-0 left-0 h-0.5 transition-all duration-300',
                        isPropertiesActive ? 'w-full bg-primary' : 'w-0 group-hover:w-full bg-brand-bright'
                      )}></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    {item.links.map(link => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link href={link.href}>{link.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={cn(
                    "group relative transition-colors px-3 py-2",
                    pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-brand-bright"
                  )}
                >
                  {item.label}
                  <span className={cn(
                    'absolute bottom-0 left-0 h-0.5 transition-all duration-300',
                    pathname === item.href ? 'w-full bg-primary' : 'w-0 group-hover:w-full bg-brand-bright'
                  )}></span>
                </Link>
              )
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" aria-label="Wishlist" className="hidden md:inline-flex text-muted-foreground hover:bg-brand-bright hover:text-white transition-colors">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="User Profile" className="hidden md:inline-flex text-muted-foreground hover:bg-brand-bright hover:text-white transition-colors">
            <User className="h-5 w-5" />
          </Button>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] bg-brand-deep text-white p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 flex justify-between items-center border-b border-white/10">
                    <Logo className="text-white" />
                    <SheetClose asChild>
                       <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                         <X className="h-6 w-6"/>
                       </Button>
                    </SheetClose>
                  </div>
                  <nav className="flex-grow p-4">
                    <ul className="space-y-2">
                      {mobileNavLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "block rounded-md px-3 py-2 text-lg font-headline transition-colors",
                               pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                                ? "bg-brand-bright"
                                : "hover:bg-white/10"
                            )}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
