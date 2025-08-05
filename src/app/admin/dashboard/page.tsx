
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, DollarSign, Handshake } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { title: "Total Properties", value: "50", icon: Building, description: "All properties listed" },
  { title: "For Sale", value: "27", icon: DollarSign, description: "Properties currently for sale" },
  { title: "Sold Properties", value: "10", icon: Handshake, description: "Successfully sold properties" },
  { title: "Total Agents", value: "3", icon: Users, description: "Active real estate agents" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-8">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
        <div className="grid md:grid-cols-3 gap-4">
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
        </div>
      </div>
    </div>
  );
}
