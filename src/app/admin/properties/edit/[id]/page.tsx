
import { getProperty, getAgents } from "@/lib/data";
import { notFound } from "next/navigation";
import { EditPropertyForm } from "@/components/admin/edit-property-form";
import type { Agent, Property } from "@/lib/types";

// Correctly type `params` as a Promise to satisfy Next.js 15 and TypeScript
export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
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
