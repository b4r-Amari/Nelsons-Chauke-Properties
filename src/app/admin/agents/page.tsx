
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

export default function AdminAgentsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Agents</h1>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Agent
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Agent List</CardTitle>
          <CardDescription>Here you can view, edit, and delete agents.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="p-8 text-center text-muted-foreground">
            Agent management functionality will be implemented here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
