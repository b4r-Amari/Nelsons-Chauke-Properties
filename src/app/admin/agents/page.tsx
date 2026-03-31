
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getAgents, getProperties } from '@/lib/data';
import { AgentsTable } from '@/components/admin/agents-table';
import { type Property } from '@/lib/types';

export default async function AdminAgentsPage() {
  const [agentsData, propertiesData] = await Promise.all([getAgents(), getProperties()]);
  
  const agentsWithCount = agentsData.map(agent => ({
      ...agent,
      // Fixed: Filter using the single agentId field
      propertyCount: propertiesData.filter((p: Property) => String(p.agentId) === String(agent.id)).length
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Estate Agents</h1>
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
          <CardDescription>Here you can add, edit, and delete agents.</CardDescription>
        </CardHeader>
        <CardContent>
            <AgentsTable initialAgents={agentsWithCount} />
        </CardContent>
      </Card>
    </div>
  );
}
