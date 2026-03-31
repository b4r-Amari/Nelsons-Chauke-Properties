
import { getAgentById } from "@/lib/data";
import { notFound } from "next/navigation";
import { EditAgentForm } from "@/components/admin/edit-agent-form";
import type { Agent } from "@/lib/types";

export default async function EditAgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const agentData = await getAgentById(id);

  if (!agentData) {
    notFound();
  }

  return (
    <EditAgentForm initialData={agentData as Agent} />
  );
}
