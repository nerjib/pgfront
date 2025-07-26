"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Battery, Zap, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { AddDeviceModal } from "./modals/add-device-modal"
import Link from "next/link"

const devicesData = [
  {
    id: "DEV001",
    serialNumber: "SLR-2024-001",
    type: "Solar Home System",
    model: "SHS-50W",
    customer: "James Ochieng",
    location: "Nairobi, Kenya",
    status: "Active",
    batteryLevel: 85,
    lastSync: "2 minutes ago",
    installDate: "2024-01-15",
    paymentStatus: "Current",
  },
  {
    id: "DEV002",
    serialNumber: "SLR-2024-002",
    type: "Solar Home System",
    model: "SHS-100W",
    customer: "Sarah Wanjiru",
    location: "Kisumu, Kenya",
    status: "Active",
    batteryLevel: 92,
    lastSync: "5 minutes ago",
    installDate: "2024-01-20",
    paymentStatus: "Current",
  },
  {
    id: "DEV003",
    serialNumber: "SLR-2024-003",
    type: "Solar Home System",
    model: "SHS-50W",
    customer: "David Kiprop",
    location: "Eldoret, Kenya",
    status: "Offline",
    batteryLevel: 45,
    lastSync: "2 days ago",
    installDate: "2024-01-10",
    paymentStatus: "Overdue",
  },
  {
    id: "DEV004",
    serialNumber: "SLR-2024-004",
    type: "Water Pump",
    model: "WP-500L",
    customer: "Mary Nyong'o",
    location: "Mombasa, Kenya",
    status: "Active",
    batteryLevel: 78,
    lastSync: "1 hour ago",
    installDate: "2024-02-01",
    paymentStatus: "Current",
  },
]

export default function DevicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Devices</h1>
          <p className="text-muted-foreground">Monitor and manage all PayGo devices</p>
        </div>
        <AddDeviceModal />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+23 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,156</div>
            <p className="text-xs text-muted-foreground">92.7% online</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91</div>
            <p className="text-xs text-muted-foreground">7.3% offline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Battery Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+2% from yesterday</p>
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
              {devicesData.map((device) => (
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
