
"use client"

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { MoreHorizontal, Pencil, Trash2, Users, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { type Property, type Agent } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { deleteProperty, updateProperty } from '@/lib/supabase/actions';

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

export function PropertiesTable({ initialProperties, allAgents }: { initialProperties: Property[], allAgents: Agent[] }) {
  const [propertyList, setPropertyList] = useState<Property[]>(initialProperties);
  const [agents, setAgents] = useState<Agent[]>(allAgents);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 10;
  const [sortConfig, setSortConfig] = useState<{ key: keyof Property, direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    setPropertyList(initialProperties);
    setAgents(allAgents);
  }, [initialProperties, allAgents]);


  const sortedProperties = useMemo(() => {
    let sortableProperties = [...propertyList];
    if (sortConfig !== null) {
      sortableProperties.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProperties;
  }, [propertyList, sortConfig]);

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = sortedProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(propertyList.length / propertiesPerPage);

  const requestSort = (key: keyof Property) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof Property) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  const handleAgentAssigned = async (propertyId: string, newAgentId: string) => {
    const result = await updateProperty(propertyId, { agentId: newAgentId });
    if (result.success) {
        const agentName = agents.find(a => String(a.id) === newAgentId)?.name || 'The assigned agent';
        const propertyAddress = propertyList.find(p => p.id === propertyId)?.title || 'the property';
      toast({
        title: "Agent Reassigned",
        description: `${agentName} has been assigned to ${propertyAddress}.`,
      });
      // Fixed: Update using singular agentId
      setPropertyList(propertyList.map(p => p.id === propertyId ? {...p, agentId: newAgentId} : p));
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "An unknown error occurred.",
      });
    }
  };

  const handleDelete = async (id: string, address: string) => {
    if (confirm(`Are you sure you want to delete the property: ${address}?`)) {
        const result = await deleteProperty(id);
        if(result.success) {
            toast({
                title: "Property Deleted",
                description: `${address} has been successfully deleted.`,
            });
            setPropertyList(propertyList.filter(p => p.id !== id));
        } else {
             toast({
                variant: "destructive",
                title: "Error Deleting Property",
                description: result.error || "An unknown error occurred.",
            });
        }
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
    <div className="overflow-x-auto">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead className="hidden sm:table-cell">
                    <Button variant="ghost" onClick={() => requestSort('id')}>
                        ID
                        {getSortIndicator('id')}
                    </Button>
                </TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('title')}>
                        Address
                        {getSortIndicator('title')}
                    </Button>
                </TableHead>
                <TableHead className="hidden lg:table-cell">Agent(s)</TableHead>
                <TableHead className="hidden md:table-cell">
                    <Button variant="ghost" onClick={() => requestSort('price')}>
                        Price
                        {getSortIndicator('price')}
                    </Button>
                </TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('status')}>
                        Status
                        {getSortIndicator('status')}
                    </Button>
                </TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {currentProperties.map((property) => {
                const propertyAgent = agents.find(agent => String(agent.id) === String(property.agentId));
                return (
                <TableRow key={property.id}>
                    <TableCell className="font-mono text-xs hidden sm:table-cell">{String(property.id).substring(0, 5)}</TableCell>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                    {propertyAgent ? (
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 border-2 border-white">
                                <AvatarImage src={propertyAgent.photoUrl} alt={propertyAgent.name} />
                                <AvatarFallback>{propertyAgent.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{propertyAgent.name}</span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground text-xs italic">Unassigned</span>
                    )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{formatPrice(property.price, property.status)}</TableCell>
                    <TableCell>
                    <Badge 
                        variant={property.status === 'sold' ? 'destructive' : 'default'}
                        className={cn(
                        'whitespace-nowrap',
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
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/properties/edit/${property.id}`}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(String(property.id), property.title)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AssignAgentDialog property={property} agents={agents} onAgentAssigned={handleAgentAssigned} />
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                )
            })}
            </TableBody>
        </Table>
    </div>
    <CardFooter className="flex-col sm:flex-row items-center border-t mt-6 pt-6">
        <div className="text-xs text-muted-foreground mb-4 sm:mb-0">
            Showing <strong>{indexOfFirstProperty + 1}-{Math.min(indexOfLastProperty, propertyList.length)}</strong> of <strong>{propertyList.length}</strong> properties
        </div>
        <div className="flex items-center space-x-2 ml-auto">
            <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    </CardFooter>
    </>
  );
}

function AssignAgentDialog({ property, agents, onAgentAssigned }: { property: Property; agents: Agent[]; onAgentAssigned: (propertyId: string, agentId: string) => void; }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>(property.agentId || undefined);

  const handleSubmit = () => {
    if (selectedAgentId) {
      onAgentAssigned(String(property.id), selectedAgentId);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-left">
            <Users className="mr-2 h-4 w-4" /> Reassign Agent
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reassign Agent</DialogTitle>
          <DialogDescription>
            Assign a new agent to the property: <span className="font-semibold">{property.title}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <Label htmlFor="agent-select">Select Agent</Label>
            <Select value={selectedAgentId} onValueChange={(value) => setSelectedAgentId(value)}>
                <SelectTrigger id="agent-select">
                    <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                    {agents.map(agent => (
                        <SelectItem key={agent.id} value={String(agent.id)}>
                            {agent.name}
                        </SelectItem>
                    ))
                }
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
