import AgentDetailPage from "../../../components/agent-detail-page"

export default function AgentPage({ params }) {
  return <AgentDetailPage agentId={params.id} />
}
