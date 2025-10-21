'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAuthToken } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import https from "@/services/https";
import { Input } from "@/components/ui/input";

export default function InventoryPage() {
  const [devices, setDevices] = useState([]);
  const [superAgents, setSuperAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedSuperAgent, setSelectedSuperAgent] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [agentsData, setAgentsData] = useState([]);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [assigneeType, setAssigneeType] = useState("super-agent");

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/devices`, {
        headers: {
          "x-auth-token": token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error("Error fetching devices:", error);
      setError("Failed to load devices. Please try again later.");
    }
  };

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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuperAgents(data);
    } catch (error) {
      console.error("Error fetching super agents:", error);
      toast({
        title: "Error",
        description: "Failed to load super agents.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    Promise.all([fetchDevices(), fetchSuperAgents(), fetchAgents()])
      .finally(() => setLoading(false));
  }, []);

  const handleDeviceSelect = (deviceId) => {
    setSelectedDevices((prevSelected) =>
      prevSelected.includes(deviceId)
        ? prevSelected.filter((id) => id !== deviceId)
        : [...prevSelected, deviceId]
    );
  };

  const handleAssign = async () => {
    if (selectedDevices.length === 0) {
      toast({
        title: "Warning",
        description: "Please select at least one device.",
        variant: "warning",
      });
      return;
    }

    let url;
    let body;
    let method;
    let assigneeName;

    if (assigneeType === "super-agent") {
      if (!selectedSuperAgent) {
        toast({
          title: "Warning",
          description: "Please select a super agent.",
          variant: "warning",
        });
        return;
      }
      url = `${https.baseUrl}/admin/assign-device-to-super-agent`;
      body = JSON.stringify({
        deviceIds: selectedDevices,
        superAgentId: selectedSuperAgent,
      });
      method = "PUT";
      assigneeName = "super agent";
    } else if (assigneeType === "agent") {
      if (!selectedAgent) {
        toast({
          title: "Warning",
          description: "Please select an agent.",
          variant: "warning",
        });
        return;
      }
      url = `${https.baseUrl}/admin/assign-device-to-agent`;
      body = JSON.stringify({
        deviceIds: selectedDevices,
        agentId: selectedAgent,
      });
      method = "POST";
      assigneeName = "agent";
    } else {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Success",
        description: `Devices assigned successfully to ${assigneeName}!`,
      });
      setIsAssignModalOpen(false);
      setSelectedDevices([]);
      setSelectedSuperAgent("");
      setSelectedAgent("");
      setAssigneeSearch("");
      fetchDevices(); // Refresh device list
    } catch (error) {
      console.error(`Error assigning devices to ${assigneeName}:`, error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign devices. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading inventory...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  const filteredDevices = devices.filter(device =>
    device.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableDevices = filteredDevices.filter(device => device.assignedById === null && device.superAgentId === null);
  const assignedDevices = filteredDevices.filter(device => device.assignedById !== null || device.superAgentId !== null);

  const filteredSuperAgents = superAgents.filter(sa => sa.name.toLowerCase().includes(assigneeSearch.toLowerCase()));
  const filteredAgents = agentsData.filter(agent => agent.name.toLowerCase().includes(assigneeSearch.toLowerCase()));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Inventory</CardTitle>
        <CardDescription>A comprehensive list of all devices in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
            <Input
                placeholder="Search by serial number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
            />
        </div>
        <Tabs defaultValue="available">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Devices ({availableDevices.length})</TabsTrigger>
            <TabsTrigger value="assigned">Assigned Devices ({assignedDevices.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="available">
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => setIsAssignModalOpen(true)}
                disabled={selectedDevices.length === 0}
              >
                Assign Selected Devices
              </Button>
            </div>
            {availableDevices.length === 0 ? (
              <div className="text-center py-8">No available devices found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Select</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Install Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedDevices.includes(device.id)}
                          onCheckedChange={() => handleDeviceSelect(device.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{device.serialNumber}</TableCell>
                      <TableCell>{device.type}</TableCell>
                      <TableCell>{device.model}</TableCell>
                      <TableCell>
                      {device.plan && Object.keys(device.plan).length > 0 ? (
                            <ul className="list-none p-0 m-0">
                              {Object.entries(device.plan).map(([planName, price]) => (
                                <li key={planName} className="text-sm">
                                  <span className="capitalize">{planName.replace('-', ' ')}:</span>{' '}
                                  <span className="font-medium">
                                    {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-muted-foreground">No plans</span>
                          )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">
                          {device.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(device.installDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
          <TabsContent value="assigned">
            {assignedDevices.length === 0 ? (
              <div className="text-center py-8">No assigned devices found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Super Agent</TableHead>
                    <TableHead>Install Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">{device.serialNumber}</TableCell>
                      <TableCell>{device.type}</TableCell>
                      <TableCell>{device.assignedToCustomerName || 'N/A'}</TableCell>
                      <TableCell>{device.assignedByAgentName || 'N/A'}</TableCell>
                      <TableCell>{device.superAgentName || 'N/A'}</TableCell>
                      <TableCell>{new Date(device.installDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {device.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Devices</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="super-agent" onValueChange={value => {
            setAssigneeType(value);
            setAssigneeSearch('');
            setSelectedAgent('');
            setSelectedSuperAgent('');
          }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="super-agent">To Super Agent</TabsTrigger>
              <TabsTrigger value="agent">To Agent</TabsTrigger>
            </TabsList>
            <TabsContent value="super-agent">
              <div className="grid gap-4 py-4">
                <Input
                    placeholder="Search super agent by name..."
                    value={assigneeSearch}
                    onChange={(e) => setAssigneeSearch(e.target.value)}
                    className="my-2"
                />
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="superAgent" className="text-right">
                    Super Agent
                  </Label>
                  <Select onValueChange={setSelectedSuperAgent} value={selectedSuperAgent}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a super agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSuperAgents.map((sa) => (
                        <SelectItem key={sa.id} value={sa.id}>
                          {sa.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected Devices: {selectedDevices.length}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="agent">
              <div className="grid gap-4 py-4">
                <Input
                    placeholder="Search agent by name..."
                    value={assigneeSearch}
                    onChange={(e) => setAssigneeSearch(e.target.value)}
                    className="my-2"
                />
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="agent" className="text-right">
                    Agent
                  </Label>
                  <Select onValueChange={setSelectedAgent} value={selectedAgent}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredAgents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected Devices: {selectedDevices.length}
                </p>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAssign}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
