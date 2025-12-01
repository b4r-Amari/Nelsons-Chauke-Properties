
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getProperties, getAgents } from '@/lib/data';
import { PropertiesTable } from '@/components/admin/properties-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminPropertiesPage() {
  const [propertyList, agents] = await Promise.all([getProperties(), getAgents()]);

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
          <CardDescription>Here you can add, edit, assign, and delete properties.</CardDescription>
        </CardHeader>
        <CardContent>
              <PropertiesTable initialProperties={propertyList} allAgents={agents} />
        </CardContent>
      </Card>
    </div>
  );
}
