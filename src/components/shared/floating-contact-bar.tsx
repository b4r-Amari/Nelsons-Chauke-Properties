
"use client";

import React from 'react';
import { Phone, MessageSquare, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Agent } from './agent-card';

export function FloatingContactBar({ agent }: { agent: Agent }) {

  const whatsappNumber = agent.phone.replace(/[^0-9]/g, '');
  const whatsappLink = `https://wa.me/27${whatsappNumber.substring(whatsappNumber.length - 9)}`;

  return (
    <div className="fixed bottom-2 left-2 right-2 z-50 lg:hidden mg:hidden">
      <div className="bg-background/80 backdrop-blur-lg border shadow-2xl rounded-full p-2">
        <div className="flex items-center gap-1">
          <Button asChild size="icon" className="flex-1 bg-green-500 hover:bg-green-600 rounded-l-full">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageSquare className="mr-2 h-5 w-5" />
              WhatsApp
            </a>
          </Button>
          <Button asChild size="icon" className="flex-1 bg-brand-bright hover:bg-brand-deep">
            <a href={`tel:${agent.phone}`}>
              <Phone className="mr-2 h-5 w-5" />
              Call
            </a>
          </Button>
          <Button asChild size="icon" variant="outline" className="rounded-full">
            <a href={`mailto:${agent.email}`}>
              <Mail className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
