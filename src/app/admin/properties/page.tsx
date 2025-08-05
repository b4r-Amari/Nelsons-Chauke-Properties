
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

export default function AdminPropertiesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Properties</h1>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Property
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Property List</CardTitle>
          <CardDescription>Here you can view, edit, and delete properties.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground">
            Property management functionality will be implemented here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
