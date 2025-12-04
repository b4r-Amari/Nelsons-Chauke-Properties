
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, DollarSign, Newspaper, KeyRound, Archive } from 'lucide-react';
import Link from 'next/link';
import { getProperties, getAgents, getBlogPosts } from '@/lib/data';
import { type Property } from '@/components/shared/property-card';
import { useEffect, useState } from 'react';
import { type Agent } from '@/components/shared/agent-card';
import { type BlogPost } from '@/components/shared/blog-card';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState([
    { title: "Total Properties", value: 0, icon: Building, description: "All properties listed" },
    { title: "For Sale", value: 0, icon: DollarSign, description: "Properties currently for sale" },
    { title: "To Let", value: 0, icon: KeyRound, description: "Properties currently for rent" },
    { title: "Sold", value: 0, icon: Archive, description: "Properties that have been sold" },
    { title: "Total Agents", value: 0, icon: Users, description: "Active real estate agents" },
    { title: "Blog Posts", value: 0, icon: Newspaper, description: "Published articles" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      // Pass empty object to get ALL properties including sold
      const [propertiesData, agentsData, blogData] = await Promise.all([
        getProperties({}), 
        getAgents(),
        getBlogPosts(),
      ]);

      setStats([
        { title: "Total Properties", value: propertiesData.length, icon: Building, description: "All properties listed" },
        { title: "For Sale", value: propertiesData.filter((p: Property) => p.status === 'for-sale').length, icon: DollarSign, description: "Properties currently for sale" },
        { title: "To Let", value: propertiesData.filter((p: Property) => p.status === 'to-let').length, icon: KeyRound, description: "Properties currently for rent" },
        { title: "Sold", value: propertiesData.filter((p: Property) => p.status === 'sold').length, icon: Archive, description: "Properties that have been sold" },
        { title: "Total Agents", value: agentsData.length, icon: Users, description: "Active real estate agents" },
        { title: "Blog Posts", value: blogData.length, icon: Newspaper, description: "Published articles" },
      ]);
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-8">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold font-headline mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/admin/properties/new">
                 <Card className="flex items-center justify-center p-6 text-center hover:bg-muted transition-colors cursor-pointer">
                    <div>
                        <Building className="h-8 w-8 mx-auto text-brand-deep mb-2" />
                        <p className="font-semibold">Add New Property</p>
                    </div>
                </Card>
            </Link>
             <Link href="/admin/agents/new">
                <Card className="flex items-center justify-center p-6 text-center hover:bg-muted transition-colors cursor-pointer">
                    <div>
                        <Users className="h-8 w-8 mx-auto text-brand-deep mb-2" />
                        <p className="font-semibold">Add New Agent</p>
                    </div>
                </Card>
            </Link>
            <Link href="/admin/blogs/new">
                <Card className="flex items-center justify-center p-6 text-center hover:bg-muted transition-colors cursor-pointer">
                    <div>
                        <Newspaper className="h-8 w-8 mx-auto text-brand-deep mb-2" />
                        <p className="font-semibold">Add New Blog Post</p>
                    </div>
                </Card>
            </Link>
        </div>
      </div>
    </div>
  );
}
