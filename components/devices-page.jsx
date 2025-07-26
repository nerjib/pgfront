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
import Link from "next/link"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeviceTypesList } from "./device-types-list";

export default function DevicesPage() {
  const [devicesData, setDevicesData] = useState([]);

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
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Devices</h1>
          <p className="text-muted-foreground">Monitor and manage all PayGo devices</p>
        </div>
        <AddDeviceModal />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="device-types">Device Types</TabsTrigger>
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
                <div className="text-2xl font-bold">{devicesData.filter(device => device.status === 'Active').length}</div>
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Battery Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{devicesData.reduce((acc, device) => acc + (device.batteryLevel || 0), 0) / devicesData.length}%</div>
                <p className="text-xs text-muted-foreground">{/* Dynamic data */}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Device Management</CardTitle>
              <CardDescription>Monitor device status, battery levels, and connectivity</CardDescription>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search devices..." className="pl-8" />
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
                    <TableHead>Device</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Battery</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devicesData.length > 0 ? (
                    devicesData.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{device.type}</div>
                            <div className="text-sm text-muted-foreground">{device.serialNumber}</div>
                            <div className="text-xs text-muted-foreground">{device.model}</div>
                          </div>
                        </TableCell>
                        <TableCell>{device.customer}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {device.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={device.status === "Active" ? "default" : "destructive"}>{device.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Battery className="h-4 w-4" />
                            <span>{device.batteryLevel}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={device.paymentStatus === "Current" ? "default" : "destructive"}>
                            {device.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{device.lastSync}</TableCell>
                        <TableCell>
                          <Link href={`/devices/${device.id}`}>
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No devices found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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

