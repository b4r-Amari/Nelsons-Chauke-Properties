
"use client"

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MoreHorizontal, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { getAgents, getProperties } from '@/lib/firebase/firestore';
import type { Property } from '@/components/shared/property-card';
import type { Agent } from '@/components/shared/agent-card';


type AgentWithCount = Agent & {
    propertyCount: number;
}

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<AgentWithCount[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof AgentWithCount, direction: 'asc' | 'desc' } | null>({ key: 'id', direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        const [agentsData, propertiesData] = await Promise.all([getAgents(), getProperties()]);
        
        const agentsWithPropertyCount: AgentWithCount[] = agentsData.map(agent => ({
            ...agent,
            propertyCount: propertiesData.filter((p: Property) => p.agentIds.includes(agent.id)).length
        }));
        
        setAgents(agentsWithPropertyCount);
        setIsLoading(false);
    }
    fetchData();
  }, []);

  const sortedAgents = useMemo(() => {
    let sortableAgents = [...agents];
    if (sortConfig !== null) {
      sortableAgents.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableAgents;
  }, [agents, sortConfig]);

  const requestSort = (key: keyof AgentWithCount) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof AgentWithCount) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    }
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  if (isLoading) {
      return <div>Loading agents...</div>
  }

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
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">
                    <Button variant="ghost" onClick={() => requestSort('id')}>
                        ID {getSortIndicator('id')}
                    </Button>
                </TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('name')}>
                        Name {getSortIndicator('name')}
                    </Button>
                </TableHead>
                <TableHead>
                     <Button variant="ghost" onClick={() => requestSort('role')}>
                        Role {getSortIndicator('role')}
                    </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">
                    <Button variant="ghost" onClick={() => requestSort('propertyCount')}>
                        Properties {getSortIndicator('propertyCount')}
                    </Button>
                </TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-mono text-xs hidden sm:table-cell">{agent.id.substring(0,5)}...</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                          <AvatarImage src={agent.imageUrl} alt={agent.name} />
                          <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{agent.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{agent.role}</TableCell>
                  <TableCell className="hidden md:table-cell">{agent.email}</TableCell>
                   <TableCell className="text-center hidden sm:table-cell">{agent.propertyCount}</TableCell>
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
