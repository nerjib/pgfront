'use client'

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

export default function SuperAgentDetailPage({ superAgentId }) {
  const [superAgent, setSuperAgent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [managedDevices, setManagedDevices] = useState([]);
  const [isDevicesLoading, setIsDevicesLoading] = useState(false);
  const [devicesError, setDevicesError] = useState(null);
  const [isGeneratingAccount, setIsGeneratingAccount] = useState(false);


  const fetchSuperAgentData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${https.baseUrl}/super-agents/${superAgentId}`, {
        headers: {
          "x-auth-token": token,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch super agent data")
      }
      const data = await response.json()
      setSuperAgent(data)
    } catch (err) {
      setError(err.message)
      console.error("Error fetching super agent:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchManagedDevices = async () => {
    setIsDevicesLoading(true);
    setDevicesError(null);
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${https.baseUrl}/admin/super-agent-devices/${superAgentId}`, {
            headers: { "x-auth-token": token },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch managed devices");
        }
        const data = await response.json();
        setManagedDevices(data);
    } catch (err) {
        setDevicesError(err.message);
        console.error("Error fetching managed devices:", err);
    } finally {
        setIsDevicesLoading(false);
    }
  };

  const generateAccountNumber = async () => {
    setIsGeneratingAccount(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/agents/${superAgentId}/dedicated-account`, {
        method: 'POST',
        headers: {
          "x-auth-token": token,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to generate account number");
      }
      // Refresh agent data to get the new account number
      fetchSuperAgentData();
    } catch (err) {
      setError(err.message);
      console.error("Error generating account number:", err);
    } finally {
      setIsGeneratingAccount(false);
    }
  };

  useEffect(() => {
    if (superAgentId) {
      fetchSuperAgentData()
      fetchManagedDevices()
    }
  }, [superAgentId])

  if (isLoading || !superAgent) {
    return <div>Loading super agent data...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/agents">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Super Agents
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{superAgent.name}</h1>
            <p className="text-muted-foreground">Super Agent ID: {superAgent.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <AddCreditModal userId={superAgent.id} userType="super-agent" onCreditAdded={fetchSuperAgentData} />
          <Badge
            variant={
              superAgent.status === "active" ? "default" : "secondary"
            }
          >
            {superAgent.status}
          </Badge>
          <Button variant="outline" size="sm">
            Edit Super Agent
          </Button>
        </div>
      </div>

      {/* Super Agent Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales (Managed Agents)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NGN {superAgent.totalSales?.toLocaleString() || "0.00"}</div>
            <p className="text-xs text-muted-foreground">Total value of loans managed by agents under this super agent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agents Managed</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{superAgent.agentsManaged}</div>
            <p className="text-xs text-muted-foreground">Agents under this super agent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{superAgent.commissionRate}%</div>
            <p className="text-xs text-muted-foreground">Current commission rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NGN {superAgent.commissionBalance?.toLocaleString() || "0.00"}</div>
            <p className="text-xs text-muted-foreground">Available for withdrawal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NGN {superAgent.credit_balance?.toLocaleString() || "0.00"}</div>
            <p className="text-xs text-muted-foreground">Super agent's wallet balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="managed-agents">Managed Agents</TabsTrigger>
              <TabsTrigger value="managed-devices">Managed Devices</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawal History</TabsTrigger>
              <TabsTrigger value="credit-summary">Credit Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Super Agent Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">{superAgent.name}</h3>
                      <p className="text-sm text-muted-foreground">{superAgent.id}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{superAgent.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{superAgent.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{superAgent.address}, {superAgent.city}, {superAgent.region}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Landmark className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Landmark: {superAgent.landmark}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Joined: {new Date(superAgent.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <History className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Last Active: {superAgent?.lastActive ? new Date(superAgent.lastActive).toLocaleString() : 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                      {superAgent.accountNumber ? (
                        <span className="text-sm">{superAgent.accountNumber}</span>
                      ) : (
                        <Button onClick={generateAccountNumber} disabled={isGeneratingAccount}>
                          {isGeneratingAccount ? 'Generating...' : 'Generate Account Number'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="managed-agents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Managed Agents</CardTitle>
                </CardHeader>
                <CardContent>
                  {superAgent.managedAgents && superAgent.managedAgents.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {superAgent.managedAgents.map((agent) => (
                        <Card key={agent.id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                            <Badge variant={agent.status === "active" ? "default" : "secondary"}>
                              {agent.status}
                            </Badge>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p className="text-sm text-muted-foreground">Email: {agent.email}</p>
                            <p className="text-sm text-muted-foreground">Phone: {agent.phone}</p>
                            <p className="text-sm text-muted-foreground">Devices Managed: {agent.devicesManaged}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No agents managed by this super agent.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="managed-devices" className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Managed Devices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isDevicesLoading ? (
                            <p>Loading devices...</p>
                        ) : devicesError ? (
                            <p className="text-red-500">{devicesError}</p>
                        ) : managedDevices.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Serial Number</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Assigned to Agent</TableHead>
                                        <TableHead>Assigned to Customer</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {managedDevices.map((device) => (
                                        <TableRow key={device.id}>
                                            <TableCell>{device.serialNumber}</TableCell>
                                            <TableCell>{device.type}</TableCell>
                                            <TableCell><Badge variant="default">{device.status}</Badge></TableCell>
                                            <TableCell>{device.assignedByAgentName || 'N/A'}</TableCell>
                                            <TableCell>{device.assignedToCustomerName || 'N/A'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-muted-foreground">No devices managed by this super agent.</p>
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
                  {superAgent.withdrawalHistory && superAgent.withdrawalHistory.length > 0 ? (
                    <div className="space-y-4">
                      {superAgent.withdrawalHistory.map((withdrawal) => (
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
              <CreditSummary userId={superAgentId} userType="super-agent" />
            </TabsContent>

          </Tabs>
        </div>

        {/* Quick Actions Sidebar */}
        {/* Assuming AgentQuickActions is a generic component that can take a superAgent prop */}
        {/* You might need to create a SuperAgentQuickActions component if the actions are different */}
        {/* For now, I'm uncommenting it and passing the superAgent prop */}
        {/* Ensure you have a component named AgentQuickActions or create SuperAgentQuickActions */}
        {/* <AgentQuickActions agent={superAgent} onAction={handleAgentAction} isLoading={isLoading} /> */}
      </div>
      </div>
  )
}