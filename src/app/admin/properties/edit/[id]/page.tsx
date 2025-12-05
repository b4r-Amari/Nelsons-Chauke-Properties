
import { getProperty, getAgents } from "@/lib/data";
import { notFound } from "next/navigation";
import { EditPropertyForm } from "@/components/admin/edit-property-form";
import type { Agent } from "@/components/shared/agent-card";
import type { Property } from "@/components/shared/property-card";

type PageProps = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = params;
  
  // Fetch data on the server
  const [propertyData, agentsData] = await Promise.all([
    getProperty(id),
    getAgents()
  ]);

  // Handle case where property is not found
  if (!propertyData) {
    notFound();
  }

  return (
    <EditPropertyForm initialData={propertyData as Property} allAgents={agentsData as Agent[]} />
  );
}
