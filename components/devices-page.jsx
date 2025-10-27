"use client"

import { useState, useEffect } from "react";
import https from "@/services/https";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Battery, Zap, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { AddDeviceModal } from "./modals/add-device-modal"
import { UploadDevicesModal } from "./modals/upload-devices-modal";
import Link from "next/link"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeviceTypesList } from "./device-types-list";
import { useToast } from "@/hooks/use-toast";
import Swal from "sweetalert2";

export default function DevicesPage() {
  const [devicesData, setDevicesData] = useState([]);
  const [reload, setReload] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDevices, setFilteredDevices] = useState([]);
  const { toast } = useToast();

  const reprocessDevice = async (deviceId) => {
    const { value: formValues } = await Swal.fire({
      title: 'Reprocess Device',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Reason for reprocessing">' +
        '<textarea id="swal-input2" class="swal2-textarea" placeholder="Notes"></textarea>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Reprocess',
      preConfirm: () => {
        const reason = document.getElementById('swal-input1').value;
        if (!reason) {
          Swal.showValidationMessage('Reason is required');
          return;
        }
        return {
          reason: reason,
          notes: document.getElementById('swal-input2').value
        }
      }
    });

    if (formValues) {
      const { reason, notes } = formValues;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${https.baseUrl}/admin/devices/${deviceId}/reprocess`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({ reason, notes }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(JSON.stringify(errorData));
        }

        toast({
          title: "Device Reprocessed",
          description: "The device has been successfully reprocessed.",
        });
        fetchDevices(); // Refresh the device list
      } catch (error) {
        let errorMsg = "Failed to reprocess the device.";
        let description = "Failed to reprocess the device.";
        try {
          const errorData = JSON.parse(error.message);
          errorMsg = errorData.msg;
          description = errorData.msg;
          if (errorData.loan_id) {
            description = (
              <>
                {errorData.msg} <Link href={`/loans/${errorData.loan_id}`} className="underline">View Loan</Link>
              </>
            );
          }
        } catch (e) {
          errorMsg = error.message;
          description = error.message;
        }

        Swal.fire('Ooops!', errorMsg, 'error' );

        toast({
          title: "Error",
          description: description,
          variant: "destructive",
        });
      }
    }
  };
  // const { toast } = useToast();

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/devices`, {
        headers: {
          "x-auth-token": token,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch devices");
      }
      const data = await response.json();
      setDevicesData(data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [reload]);

  useEffect(() => {
    setFilteredDevices(
      devicesData.filter(device =>
        device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, devicesData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Devices</h1>
          <p className="text-muted-foreground">Monitor and manage all PayGo devices</p>
        </div>
        <div className="flex items-center gap-2">
          <UploadDevicesModal onUploadComplete={fetchDevices} />
          <AddDeviceModal reload={reload} setReload={setReload} />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="device-types">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{devicesData.length}</div>
                <p className="text-xs text-muted-foreground">{/* Dynamic data */}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
                <Battery className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{devicesData.filter(device => device.status === 'assigned').length}</div>
                <p className="text-xs text-muted-foreground">{/* Dynamic data */}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Offline Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{devicesData.filter(device => device.status === 'Offline').length}</div>
                <p className="text-xs text-muted-foreground">{/* Dynamic data */}</p>
              </CardContent>
            </Card>
            {/* <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Battery Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{devicesData.reduce((acc, device) => acc + (device.batteryLevel || 0), 0) / devicesData.length}%</div>
                <p className="text-xs text-muted-foreground"></p>
              </CardContent>
            </Card> */}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Device Management</CardTitle>
              <CardDescription>Monitor device status, battery levels, and connectivity</CardDescription>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by serial number..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="assigned" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="assigned">Assigned</TabsTrigger>
                  <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
                  <TabsTrigger value="faulty">Faulty</TabsTrigger>
                </TabsList>
                <TabsContent value="assigned">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Battery</TableHead>
                        <TableHead>Plans</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDevices.filter(d => d.status === 'assigned').length > 0 ? (
                        filteredDevices.filter(d => d.status === 'assigned').map((device) => (
                          <TableRow key={device.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{device.type}</div>
                                <div className="text-sm text-muted-foreground">{device.serialNumber}</div>
                                <div className="text-xs text-muted-foreground">{device.model}</div>
                              </div>
                            </TableCell>
                            <TableCell>{device.assignedToCustomerName ?? device.assignedToCustomerUsername ?? 'Not assign'}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <MapPin className="mr-1 h-3 w-3" />
                                {device.location ?? 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={device.status === "assigned" ? "default" : "success"}>{device.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Battery className="h-4 w-4" />
                                <span>{device.batteryLevel}%</span>
                              </div>
                            </TableCell>
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
                            <TableCell>{device.lastSync}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" onClick={() => reprocessDevice(device.id)}>
                                Reprocess
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4">
                            No assigned devices found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="unassigned">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Battery</TableHead>
                        <TableHead>Plans</TableHead>
                        <TableHead>Last Sync</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDevices.filter(d => d.status !== 'assigned').length > 0 ? (
                        filteredDevices.filter(d => d.status !== 'assigned').map((device) => (
                          <TableRow key={device.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{device.type}</div>
                                <div className="text-sm text-muted-foreground">{device.serialNumber}</div>
                                <div className="text-xs text-muted-foreground">{device.model}</div>
                              </div>
                            </TableCell>
                            <TableCell>{device.assignedToCustomerName ?? device.assignedToCustomerUsername ?? 'Not assign'}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <MapPin className="mr-1 h-3 w-3" />
                                {device.location ?? 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={device.status === "assigned" ? "default" : "success"}>{device.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Battery className="h-4 w-4" />
                                <span>{device.batteryLevel}%</span>
                              </div>
                            </TableCell>
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
                            <TableCell>{device.lastSync}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
                            No unassigned devices found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="faulty">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDevices.filter(d => d.status === 'faulty').length > 0 ? (
                        filteredDevices.filter(d => d.status === 'faulty').map((device) => (
                          <TableRow key={device.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{device.type}</div>
                                <div className="text-sm text-muted-foreground">{device.serialNumber}</div>
                                <div className="text-xs text-muted-foreground">{device.model}</div>
                              </div>
                            </TableCell>
                            <TableCell>{device.assignedToCustomerName ?? device.assignedToCustomerUsername ?? 'N/A'}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <MapPin className="mr-1 h-3 w-3" />
                                {device.location ?? 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="destructive">{device.status}</Badge>
                            </TableCell>
                            <TableCell>{device.lastSync}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" onClick={() => reprocessDevice(device.id)}>
                                Reprocess
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            No faulty devices found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="device-types" className="space-y-4">
          <DeviceTypesList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

