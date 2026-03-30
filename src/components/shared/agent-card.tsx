
"use client"

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Agent } from "@/lib/types";

type AgentCardProps = {
  agent: Agent;
};

export function AgentCard({ agent }: AgentCardProps) {
  const photoUrl = agent.photoUrl || "/images/placeholder-agent.webp";
  
  return (
    <Link href={`/agents/${agent.slug}`} className="group block">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-4">
            <div className="flex flex-col items-center text-center gap-4">
            <div className="relative h-24 w-24 shrink-0">
                <Image
                src={photoUrl}
                alt={`Professional portrait of ${agent.firstName} ${agent.lastName}, ${agent.email} at NC Properties.`}
                fill
                className="rounded-full object-cover border-4 border-white shadow-md"
                />
            </div>
            <div>
                <h3 className="font-bold text-lg text-brand-deep group-hover:text-brand-bright transition-colors">
                  {agent.firstName} {agent.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">Property Agent</p>
            </div>
            </div>
        </CardContent>
        </Card>
    </Link>
  );
}
