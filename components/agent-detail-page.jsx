import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { AgentQuickActions } from "./agent-quick-actions"

const AgentDetailPage = ({ agent }) => {
  return (
    <Tabs defaultValue="overview" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Existing Personal Information and Employment Details cards */}
              <div>Personal Information Card</div>
              <div>Employment Details Card</div>
            </div>
          </div>
          <AgentQuickActions agent={agent} />
        </div>
      </TabsContent>
      <TabsContent value="details">Details Content</TabsContent>
      <TabsContent value="activity">Activity Content</TabsContent>
    </Tabs>
  )
}

export default AgentDetailPage
