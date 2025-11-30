
"use client";

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getProperties, getAgents } from '@/lib/data';
import { PropertiesTable } from '@/components/admin/properties-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import type { Property } from '@/components/shared/property-card';
import type { Agent } from '@/components/shared/agent-card';

export default function AdminPropertiesPage() {
  const [propertyList, setPropertyList] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [properties, allAgents] = await Promise.all([getProperties(), getAgents()]);
      setPropertyList(properties);
      setAgents(allAgents);
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Properties</h1>
        <Button asChild className="bg-brand-bright hover:bg-brand-deep">
          <Link href="/admin/properties/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Property
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Property List</CardTitle>
          <CardDescription>Here you can view, edit, assign, and delete properties.</CardDescription>
        </CardHeader>
        <CardContent>
              <PropertiesTable initialProperties={propertyList} allAgents={agents} />
        </CardContent>
      </Card>
    </div>
  );
}
