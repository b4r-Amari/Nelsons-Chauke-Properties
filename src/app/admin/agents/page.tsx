
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getAgents, getProperties } from '@/lib/data';
import type { Property } from '@/components/shared/property-card';
import { AgentsTable } from '@/components/admin/agents-table';
import { useState, useEffect } from 'react';
import { type Agent } from '@/components/shared/agent-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminAgentsPage() {
  const [agentsWithCount, setAgentsWithCount] = useState<(Agent & { propertyCount: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [agentsData, propertiesData] = await Promise.all([getAgents(), getProperties()]);
      
      const agentsWithPropertyCount = agentsData.map(agent => ({
          ...agent,
          propertyCount: propertiesData.filter((p: Property) => p.agentIds.includes(String(agent.id))).length
      }));
      setAgentsWithCount(agentsWithPropertyCount);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Agents</h1>
        <Button asChild className="bg-brand-bright hover:bg-brand-deep">
          <Link href="/admin/agents/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Agent
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Agent List</CardTitle>
          <CardDescription>Here you can view, edit, and delete agents.</CardDescription>
        </CardHeader>
        <CardContent>
           {loading ? (
              <div className="space-y-4">
                {Array.from({length: 5}).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-grow">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                    </div>
                ))}
              </div>
           ) : (
            <AgentsTable initialAgents={agentsWithCount} />
           )}
        </CardContent>
      </Card>
    </div>
  );
}
