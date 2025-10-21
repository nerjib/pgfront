import AgentDetailPage from "@/components/agent-detail-page"

export default async function AgentPage({ params }) {
  const resolvedParams = await params;
  return <AgentDetailPage agentId={resolvedParams.id} />
}