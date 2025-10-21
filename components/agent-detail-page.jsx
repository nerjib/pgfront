'use client'

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  ArrowLeft,
  DollarSign,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  Landmark,
  Wallet,
  History,
} from "lucide-react"
import Link from "next/link"
import { AddCreditModal } from "./modals/add-credit-modal";
import https from "@/services/https";
import CreditSummary from "./credit-summary";

export default function AgentDetailPage({ agentId }) {
  const [agent, setAgent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const fetchAgentData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${https.baseUrl}/agents/${agentId}`, {
        headers: {
          "x-auth-token": token,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch agent data")
      }
      const data = await response.json()
      setAgent(data)
    } catch (err) {
      setError(err.message)
      console.error("Error fetching agent:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (agentId) {
      fetchAgentData()
    }
  }, [agentId])

  if (isLoading || !agent) {
    return <div>Loading agent data...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/agents">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Agents
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
                {agent.profile_img ? (
                    <img
                        src={`data:image/jpeg;base64,${agent.profile_img}`}
                        alt={agent.name}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-500" />
                    </div>
                )}
            </div>
            <div>
                <h1 className="text-3xl font-bold">{agent.name}</h1>
                <p className="text-muted-foreground">Agent ID: {agent.id}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <AddCreditModal userId={agent.id} userType="agent" onCreditAdded={fetchAgentData} />
          <Badge
            variant={
              agent.status === "active" ? "default" : "secondary"
            }
          >
            {agent.status}
          </Badge>
          {/* <EditAgentModal agent={agent} onUpdate={fetchAgentData} /> */}
        </div>
      </div>

      {/* Agent Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NGN {agent.totalSales?.toLocaleString() || "0.00"}</div>
            <p className="text-xs text-muted-foreground">Total value of loans managed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devices Managed</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agent.devicesManaged}</div>
            <p className="text-xs text-muted-foreground">Devices assigned by this agent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agent.commissionRate}%</div>
            <p className="text-xs text-muted-foreground">Current commission rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NGN {agent.commissionBalance?.toLocaleString() || "0.00"}</div>
            <p className="text-xs text-muted-foreground">Available for withdrawal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NGN {agent.credit_balance?.toLocaleString() || "0.00"}</div>
            <p className="text-xs text-muted-foreground">Agent's wallet balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="devices">Assigned Devices</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawal History</TabsTrigger>
              <TabsTrigger value="credit-summary">Credit Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{agent.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{agent.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{agent.address}, {agent.city}, {agent.region}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Landmark className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Landmark: {agent.landmark}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Joined: {new Date(agent.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <History className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Last Active: {new Date(agent.lastActive).toLocaleString()}</span>
                    </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devices" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Devices</CardTitle>
                </CardHeader>
                <CardContent>
                  {agent.assignedDevices && agent.assignedDevices.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {agent.assignedDevices.map((device) => (
                        <Card key={device.id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{device.serialNumber}</CardTitle>
                            <Badge variant={device.status === "assigned" ? "default" : "secondary"}>
                              {device.status}
                            </Badge>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p className="text-sm text-muted-foreground">Customer: {device.customerName}</p>
                            <p className="text-sm text-muted-foreground">Install Date: {new Date(device.installDate).toLocaleDateString()}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No devices assigned by this agent.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="withdrawals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Withdrawal History</CardTitle>
                </CardHeader>
                <CardContent>
                  {agent.withdrawalHistory && agent.withdrawalHistory.length > 0 ? (
                    <div className="space-y-4">
                      {agent.withdrawalHistory.map((withdrawal) => (
                        <div key={withdrawal.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium">NGN {withdrawal.amount.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{new Date(withdrawal.date).toLocaleDateString()}</p>
                          </div>
                          <Badge variant="outline">{withdrawal.transactionId || "N/A"}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No withdrawal history available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="credit-summary">
              <CreditSummary userId={agentId} userType="agent" />
            </TabsContent>

          </Tabs>
        </div>

        {/* Quick Actions Sidebar */}
        {/* <AgentQuickActions agent={agent} onAction={handleAgentAction} isLoading={isLoading} /> */}
      </div>
      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
        <DialogContent className="max-w-md">
            {agent.profile_img ? (
                <img
                    src={`data:image/jpeg;base64,${agent.profile_img}`}
                    alt={agent.name}
                    className="w-full h-auto rounded-lg"
                />
            ) : (
                <div className="w-full h-auto bg-gray-200 rounded-lg flex items-center justify-center" style={{ aspectRatio: '1 / 1' }}>
                    <User className="h-32 w-32 text-gray-500" />
                </div>
            )}
        </DialogContent>
      </Dialog>
    </div>
  )
}