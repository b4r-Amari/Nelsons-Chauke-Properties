
'use client';

import { Phone, MessageSquare, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Agent } from './agent-card';
import Link from 'next/link';

export function FloatingContactBar({ agent }: { agent: Agent }) {
  const whatsappNumber = agent.phone.replace(/[^0-9]/g, '');
  const whatsappLink = `https://wa.me/27${whatsappNumber.substring(whatsappNumber.length - 9)}`;

  return (
    <div className="fixed bottom-2 left-2 right-2 z-50 rounded-lg border bg-background/95 p-2 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/75 md:hidden">
      <div className="container mx-auto px-0">
        <div className="grid grid-cols-3 gap-2">
          <Button asChild variant="outline" className="h-12 text-brand-deep">
            <a href={`tel:${agent.phone}`}>
              <Phone className="mr-2 h-5 w-5" />
              Call
            </a>
          </Button>
          <Button asChild className="h-12 bg-[#25D366] hover:bg-[#1DAA53] text-white">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageSquare className="mr-2 h-5 w-5" />
              WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" className="h-12 text-brand-deep">
            <a href={`mailto:${agent.email}`}>
              <Mail className="mr-2 h-5 w-5" />
              Email
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
