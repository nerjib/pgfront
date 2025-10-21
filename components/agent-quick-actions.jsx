"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Phone, MapPin, Calendar, AlertTriangle, Ban, UserCheck } from "lucide-react"

export function AgentQuickActions({ agent }) {
  const handleAction = (action) => {
    console.log(`Performing action: ${action} for agent ${agent.id}`)
    // Implement actual action logic here
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common management tasks for this agent</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm" onClick={() => handleAction("call")} className="justify-start">
            <Phone className="mr-2 h-4 w-4" />
            Call Agent
          </Button>

          <Button variant="outline" size="sm" onClick={() => handleAction("message")} className="justify-start">
            <MessageSquare className="mr-2 h-4 w-4" />
            Send Message
          </Button>

          <Button variant="outline" size="sm" onClick={() => handleAction("track")} className="justify-start">
            <MapPin className="mr-2 h-4 w-4" />
            Track Location
          </Button>

          <Button variant="outline" size="sm" onClick={() => handleAction("schedule")} className="justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Visit
          </Button>
        </div>

        <div className="pt-3 border-t space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("activate")}
            className="w-full justify-start text-green-600 hover:text-green-700"
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Activate Agent
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("suspend")}
            className="w-full justify-start text-yellow-600 hover:text-yellow-700"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Suspend Agent
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("deactivate")}
            className="w-full justify-start text-red-600 hover:text-red-700"
          >
            <Ban className="mr-2 h-4 w-4" />
            Deactivate Agent
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
