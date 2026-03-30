
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, DollarSign, Newspaper, KeyRound, Archive } from 'lucide-react';
import Link from 'next/link';
import { getProperties, getAgents, getBlogPosts } from '@/lib/data';

export default async function AdminDashboardPage() {
  // Fetch all data on the server in parallel
  const [propertiesData, agentsData, blogData] = await Promise.all([
    getProperties({}), 
    getAgents(),
    getBlogPosts(),
  ]);

  const stats = [
    { 
      title: "Total Properties", 
      value: propertiesData.length, 
      icon: Building, 
      description: "All properties listed" 
    },
    { 
      title: "For Sale", 
      value: propertiesData.filter(p => p.status === 'for-sale').length, 
      icon: DollarSign, 
      description: "Properties for sale" 
    },
    { 
      title: "To Let", 
      value: propertiesData.filter(p => p.status === 'to-let').length, 
      icon: KeyRound, 
      description: "Properties for rent" 
    },
    { 
      title: "Sold", 
      value: propertiesData.filter(p => p.status === 'sold').length, 
      icon: Archive, 
      description: "Properties sold" 
    },
    { 
      title: "Total Agents", 
      value: agentsData.length, 
      icon: Users, 
      description: "Active real estate agents" 
    },
    { 
      title: "Blog Posts", 
      value: blogData.length, 
      icon: Newspaper, 
      description: "Published articles" 
    },
  ];

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
            <Link href="/admin/properties/new" className="block">
                 <Card className="flex items-center justify-center p-6 text-center hover:bg-muted transition-colors cursor-pointer h-full">
                    <div>
                        <Building className="h-8 w-8 mx-auto text-brand-deep mb-2" />
                        <p className="font-semibold">Add New Property</p>
                    </div>
                </Card>
            </Link>
             <Link href="/admin/agents/new" className="block">
                <Card className="flex items-center justify-center p-6 text-center hover:bg-muted transition-colors cursor-pointer h-full">
                    <div>
                        <Users className="h-8 w-8 mx-auto text-brand-deep mb-2" />
                        <p className="font-semibold">Add New Agent</p>
                    </div>
                </Card>
            </Link>
            <Link href="/admin/blogs/new" className="block">
                <Card className="flex items-center justify-center p-6 text-center hover:bg-muted transition-colors cursor-pointer h-full">
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
