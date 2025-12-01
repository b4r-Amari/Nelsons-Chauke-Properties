
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getAgents, getProperties } from '@/lib/data';
import type { Property } from '@/components/shared/property-card';
import { AgentsTable } from '@/components/admin/agents-table';
import { type Agent } from '@/components/shared/agent-card';

export default async function AdminAgentsPage() {
  const [agentsData, propertiesData] = await Promise.all([getAgents(), getProperties()]);
  
  const agentsWithCount = agentsData.map(agent => ({
      ...agent,
      propertyCount: propertiesData.filter((p: Property) => p.agentIds.includes(agent.id as never)).length
  }));

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
            <AgentsTable initialAgents={agentsWithCount} />
        </CardContent>
      </Card>
    </div>
  );
}
