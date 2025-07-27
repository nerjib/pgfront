"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, MapPin, Phone, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { AddAgentModal } from "./modals/add-agent-modal"
import { AddSuperAgentModal } from "./modals/add-super-agent-modal";
import Link from "next/link"

import { useState, useEffect } from "react";
import https from "@/services/https";

export default function AgentsPage() {
  const [agentsData, setAgentsData] = useState([]);
  const [superAgentsData, setSuperAgentsData] = useState([]);
  const [activeTab, setActiveTab] = useState("agents");

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/agents`, {
        headers: {
          "x-auth-token": token,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch agents");
      }
      const data = await response.json();
      setAgentsData(data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const fetchSuperAgents = async () => {
    try {
      const token = localStorage.getItem("token");
      // You need to create this endpoint in your backend
      const response = await fetch(`${https.baseUrl}/super-agents`, { 
        headers: {
          "x-auth-token": token,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch super-agents");
      }
      const data = await response.json();
      setSuperAgentsData(data);
    } catch (error) {
      console.error("Error fetching super-agents:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "agents") {
      fetchAgents();
    } else {
      fetchSuperAgents();
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agents</h1>
          <p className="text-muted-foreground">Manage your field agents and sales representatives</p>
        </div>
        {activeTab === "agents" ? (
          <AddAgentModal onAgentAdded={fetchAgents} />
        ) : (
          <AddSuperAgentModal onSuperAgentAdded={fetchSuperAgents} />
        )}
      </div>

      <div className="flex border-b">
        <Button variant={activeTab === "agents" ? "ghost" : "secondary"} onClick={() => setActiveTab("agents")} className="mr-2">Agents</Button>
        <Button variant={activeTab === "super-agents" ? "ghost" : "secondary"} onClick={() => setActiveTab("super-agents")}>Super Agents</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total {activeTab === "agents" ? "Agents" : "Super Agents"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTab === "agents" ? agentsData.length : superAgentsData.length}</div>
            <p className="text-xs text-muted-foreground">{/* Dynamic data */}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active {activeTab === "agents" ? "Agents" : "Super Agents"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTab === "agents" ? agentsData.filter(agent => agent.status === 'Active').length : superAgentsData.filter(agent => agent.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">{/* Dynamic data */}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NGN {activeTab === "agents" ? agentsData.reduce((acc, agent) => acc + (parseFloat(agent.totalSales) || 0), 0).toLocaleString() : superAgentsData.reduce((acc, agent) => acc + (parseFloat(agent.totalSales) || 0), 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{/* Dynamic data */}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devices Managed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTab === "agents" ? agentsData.reduce((acc, agent) => acc + parseFloat(agent.devicesManaged || 0), 0) : superAgentsData.reduce((acc, agent) => acc + parseFloat(agent.devicesManaged || 0), 0)}</div>
            <p className="text-xs text-muted-foreground">{/* Dynamic data */}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{activeTab === "agents" ? "Agent Directory" : "Super Agent Directory"}</CardTitle>
          <CardDescription>View and manage all {activeTab === "agents" ? "field agents" : "super agents"}</CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder={`Search ${activeTab === "agents" ? "agents" : "super agents"}...`} className="pl-8" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{activeTab === "agents" ? "Agent" : "Super Agent"}</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Devices</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(activeTab === "agents" ? agentsData : superAgentsData).length > 0 && (activeTab === "agents" ? agentsData : superAgentsData).map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-muted-foreground">{agent.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-1 h-3 w-3" />
                        {agent.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="mr-1 h-3 w-3" />
                        {agent.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {agent.region}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={agent.status === "Active" ? "default" : "secondary"}>{agent.status}</Badge>
                  </TableCell>
                  <TableCell>{agent.devicesManaged}</TableCell>
                  <TableCell>NGN {agent.totalSales ? parseFloat(agent.totalSales).toLocaleString() : 0}</TableCell>
                  <TableCell>{agent.last_active ? new Date(agent.last_active).toLocaleString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Link href={`/agents/${agent.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
