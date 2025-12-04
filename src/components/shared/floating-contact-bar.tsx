
"use client";

import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Agent } from './agent-card';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413 0 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.456l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.447-4.435-9.884-9.888-9.884-5.448 0-9.886 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413z" />
  </svg>
);

export function FloatingContactBar({ agent }: { agent: Agent }) {

  const whatsappNumber = agent.phone.replace(/[^0-9]/g, '');
  const whatsappLink = `https://wa.me/27${whatsappNumber.substring(whatsappNumber.length - 9)}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden p-2">
      <div className="bg-background/80 backdrop-blur-lg border shadow-2xl rounded-xl p-2 w-full">
        <div className="grid grid-cols-3 items-center gap-1">
          <Button asChild variant="outline" className="flex-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" className="flex-1 bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800">
            <a href={`tel:${agent.phone}`} className="flex items-center justify-center gap-2">
              <Phone className="h-5 w-5" />
              Call
            </a>
          </Button>
          <Button asChild variant="outline" className="flex-1 bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800">
            <a href={`mailto:${agent.email}`} className="flex items-center justify-center gap-2">
              <Mail className="h-5 w-5" />
              Email
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
