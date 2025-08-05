
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import propertiesData from '@/data/properties.json';
import { type Property } from '@/components/shared/property-card';
import { cn } from '@/lib/utils';

const properties: Property[] = propertiesData;

const formatPrice = (price: number, status: 'for-sale' | 'to-let' | 'sold') => {
    const isRental = status === 'to-let';
    const formattedPrice = new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    return isRental ? `${formattedPrice} /month` : formattedPrice;
}


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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden sm:table-cell">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.address}</TableCell>
                  <TableCell className="hidden md:table-cell">{property.location}</TableCell>
                  <TableCell className="hidden sm:table-cell">{formatPrice(property.price, property.status)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={property.status === 'sold' ? 'destructive' : 'default'}
                      className={cn(
                        property.status === 'for-sale' && 'bg-green-600',
                        property.status === 'to-let' && 'bg-blue-600'
                      )}
                    >
                      {property.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
