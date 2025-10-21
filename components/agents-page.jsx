"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, Filter, MapPin, Phone, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { AddAgentModal } from "./modals/add-agent-modal"
import { AddSuperAgentModal } from "./modals/add-super-agent-modal";
import { EditSuperAgentModal } from "./modals/edit-super-agent-modal";
import { RejectAgentModal } from "./modals/reject-agent-modal";
import Link from "next/link"
import Swal from "sweetalert2";

import { useState, useEffect } from "react";
import https from "@/services/https";

export default function AgentsPage() {
  const [agentsData, setAgentsData] = useState([]);
  const [superAgentsData, setSuperAgentsData] = useState([]);
  const [pendingAgentsData, setPendingAgentsData] = useState([]);
  const [activeTab, setActiveTab] = useState("agents");
  const [reload, setReload] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);

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

  const fetchPendingAgents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/agents?status=pending`, {
        headers: {
          "x-auth-token": token,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch pending agents");
      }
      const data = await response.json();
      setPendingAgentsData(data);
    } catch (error) {
      console.error("Error fetching pending agents:", error);
    }
  };

  const handleApprove = async (agentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/admin/agents/${agentId}/approval`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ status: "active" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to approve agent");
      }

      Swal.fire("Agent approved successfully");
      setReload(!reload);
    } catch (error) {
      console.error("Error approving agent:", error);
      alert(error.message);
    }
  };

  useEffect(() => {
    if (activeTab === "agents") {
      fetchAgents();
    } else if (activeTab === "super-agents") {
      fetchSuperAgents();
    } else {
      fetchPendingAgents();
    }
  }, [activeTab, reload]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agents</h1>
          <p className="text-muted-foreground">Manage your field agents and sales representatives</p>
        </div>
        {activeTab === "agents" ? (
          <AddAgentModal onAgentAdded={fetchAgents} reload={reload} setReload={setReload} />
        ) : (
          <AddAgentModal onAgentAdded={fetchAgents} reload={reload} setReload={setReload} />
        )}
      </div>

      <div className="flex border-b">
        <Button variant={activeTab === "agents" ? "ghost" : "secondary"} onClick={() => setActiveTab("agents")} className="mr-2">Agents</Button>
        <Button variant={activeTab === "super-agents" ? "ghost" : "secondary"} onClick={() => setActiveTab("super-agents")} className="mr-2">Super Agents</Button>
        <Button variant={activeTab === "pending-requests" ? "ghost" : "secondary"} onClick={() => setActiveTab("pending-requests")}>Pending Requests</Button>
      </div>

      {activeTab !== "pending-requests" && (
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
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === "agents" ? "Agent Directory" : activeTab === "super-agents" ? "Super Agent Directory" : "Pending Agent Requests"}
          </CardTitle>
          <CardDescription>
            {activeTab === "agents" ? "View and manage all field agents" : activeTab === "super-agents" ? "View and manage all super agents" : "Approve or reject pending agent requests"}
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder={`Search ${activeTab === "agents" ? "agents" : activeTab === "super-agents" ? "super agents" : "requests"}...`} className="pl-8" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "pending-requests" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Profile Image</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Date Applied</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingAgentsData.length > 0 && pendingAgentsData.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-muted-foreground">{agent.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {agent.profile_img ? (
                        <Button variant="outline" size="sm" onClick={() => {
                          setSelectedProfileImage(agent.profile_img);
                          setIsProfileModalOpen(true);
                        }}>
                          View Image
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">No Image</span>
                      )}
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
                    <TableCell>{new Date(agent.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleApprove(agent.id)}>
                          Approve
                        </Button>
                        <RejectAgentModal agent={agent} onAgentRejected={() => setReload(!reload)} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{activeTab === "agents" ? "Agent" : "Super Agent"}</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Credit Balance</TableHead>
                  <TableHead>Devices</TableHead>
                  {activeTab !== "agents" &&<TableHead>Agent Managed</TableHead>}
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Total Customers</TableHead>
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
                    <TableCell>NGN {agent.credit_balance ? parseFloat(agent.credit_balance).toLocaleString() : 0}</TableCell> 
                    <TableCell>{agent.devicesManaged}</TableCell>
                    {activeTab !== "agents" && <TableCell>{agent.agentsManaged}</TableCell>}
                    <TableCell>NGN {agent.totalSales ? parseFloat(agent.totalSales).toLocaleString() : 0}</TableCell>
                    <TableCell>{agent.totalCustomers}</TableCell>
                    <TableCell>{agent.last_active ? new Date(agent.last_active).toLocaleString() : 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Link href={ activeTab === "agents" ? `/agents/${agent.id}` : `/super-agents/${agent.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        {activeTab === "super-agents" && (
                          <EditSuperAgentModal superAgent={agent} onUpdate={fetchSuperAgents} />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent>
          {selectedProfileImage && (
            <img
              src={`data:image/jpeg;base64,${selectedProfileImage}`}
              alt="Profile"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

