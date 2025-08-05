
"use client"

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import { Button } from "../ui/button";

type Agent = {
  name: string;
  role: string;
  imageUrl: string;
  imageHint: string;
  phone: string;
  email: string;
};

type AgentCardProps = {
  agent: Agent;
};

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Property Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0">
            <Image
              src={agent.imageUrl}
              alt={`Portrait of ${agent.name}`}
              data-ai-hint={agent.imageHint}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold text-lg text-brand-deep">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">{agent.role}</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
            <Button variant="outline" className="w-full justify-start gap-3">
                <Phone className="h-4 w-4 text-brand-bright" />
                <span>{agent.phone}</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
                <Mail className="h-4 w-4 text-brand-bright" />
                 <span>{agent.email}</span>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
