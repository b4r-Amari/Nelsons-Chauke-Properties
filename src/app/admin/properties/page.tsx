
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle, MoreHorizontal, Pencil, Trash2, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

import propertiesData from '@/data/properties.json';
import agentsData from '@/data/agents.json';
import { type Property } from '@/components/shared/property-card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';


const properties: Property[] = propertiesData;
const agents = agentsData;

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
  const [propertyList, setPropertyList] = useState(properties);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 10;

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = propertyList.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(propertyList.length / propertiesPerPage);


  const handleAgentAssigned = (propertyId: string, newAgentId: string) => {
    setPropertyList(prev => prev.map(p => p.id === propertyId ? { ...p, agentId: newAgentId } : p));
    const agentName = agents.find(a => a.id === newAgentId)?.name;
    const propertyAddress = propertyList.find(p => p.id === propertyId)?.address;
    toast({
      title: "Agent Reassigned",
      description: `${agentName} has been assigned to ${propertyAddress}.`,
    });
  };
  
  const getAgentById = (agentId: string) => {
    return agents.find(agent => agent.id === agentId);
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead className="hidden lg:table-cell">Agent</TableHead>
                <TableHead className="hidden sm:table-cell">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProperties.map((property) => {
                const agent = getAgentById(property.agentId);
                return (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.address}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {agent ? (
                        <div className="flex items-center gap-2">
                           <Avatar className="h-8 w-8">
                                <AvatarImage src={agent.imageUrl} alt={agent.name} />
                                <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                           <span>{agent.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
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
                            <DropdownMenuSeparator />
                             <AssignAgentDialog property={property} onAgentAssigned={handleAgentAssigned} />
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
            })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
            <div className="text-xs text-muted-foreground">
                Showing <strong>{indexOfFirstProperty + 1}-{Math.min(indexOfLastProperty, propertyList.length)}</strong> of <strong>{propertyList.length}</strong> properties
            </div>
            <div className="flex items-center space-x-2 ml-auto">
                <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}


function AssignAgentDialog({ property, onAgentAssigned }: { property: Property; onAgentAssigned: (propertyId: string, agentId: string) => void; }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>(property.agentId);

  const handleSubmit = () => {
    if (selectedAgentId) {
      onAgentAssigned(property.id, selectedAgentId);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
            <Users className="mr-2 h-4 w-4" /> Reassign Agent
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reassign Agent</DialogTitle>
          <DialogDescription>
            Assign a new agent to the property: <span className="font-semibold">{property.address}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <Label htmlFor="agent-select">Select Agent</Label>
            <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                <SelectTrigger id="agent-select">
                    <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                    {agents.map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>
                            {agent.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!selectedAgentId} className="bg-brand-bright hover:bg-brand-deep">Assign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

