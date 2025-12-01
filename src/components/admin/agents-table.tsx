
"use client"

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type Agent } from '@/components/shared/agent-card';
import { deleteAgent } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type AgentWithCount = Agent & {
    propertyCount: number;
}

export function AgentsTable({ initialAgents }: { initialAgents: AgentWithCount[] }) {
  const [agents, setAgents] = useState<AgentWithCount[]>(initialAgents);
  const [sortConfig, setSortConfig] = useState<{ key: keyof AgentWithCount, direction: 'asc' | 'desc' } | null>({ key: 'id', direction: 'asc' });
  const { toast } = useToast();

  useEffect(() => {
    setAgents(initialAgents);
  }, [initialAgents]);

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
  
  const handleDelete = async (id: string, name: string) => {
      if(confirm(`Are you sure you want to delete agent: ${name}?`)) {
          const result = await deleteAgent(id);
          if (result.success) {
              toast({
                  title: "Agent Deleted",
                  description: `${name} has been successfully deleted.`
              });
              setAgents(agents.filter(agent => String(agent.id) !== id));
          } else {
              toast({
                  variant: "destructive",
                  title: "Error",
                  description: result.error || "Could not delete agent."
              });
          }
      }
  }

  const getSortIndicator = (key: keyof AgentWithCount) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    }
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  return (
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
          <TableHead className="hidden sm:table-cell">
              <Button variant="ghost" onClick={() => requestSort('role')}>
                  Role {getSortIndicator('role')}
              </Button>
          </TableHead>
          <TableHead className="hidden md:table-cell">Email</TableHead>
          <TableHead className="hidden lg:table-cell">
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
            <TableCell className="font-mono text-xs hidden sm:table-cell">{String(agent.id).substring(0,5)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-4">
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src={agent.imageUrl} alt={agent.name} />
                    <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{agent.name}</div>
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">{agent.role}</TableCell>
            <TableCell className="hidden md:table-cell">{agent.email}</TableCell>
              <TableCell className="text-center hidden lg:table-cell">{agent.propertyCount}</TableCell>
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
                    <DropdownMenuItem onClick={() => handleDelete(String(agent.id), agent.name)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
