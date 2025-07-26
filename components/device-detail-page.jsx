"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Battery,
  Zap,
  MapPin,
  User,
  Phone,
  Mail,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { EditDeviceModal } from "./modals/edit-device-modal"
import { DeviceQuickActions } from "./device-quick-actions"

// Mock data - replace with actual data fetching
const getDeviceData = (deviceId) => {
  return {
    id: deviceId,
    serialNumber: "SLR-2024-001",
    type: "Solar Home System",
    model: "SHS-50W",
    status: "Active",
    batteryLevel: 85,
    batteryHealth: 92,
    energyGenerated: 45.2,
    lastSync: "2 minutes ago",
    installDate: "2024-01-15",
    warrantyExpiry: "2026-01-15",
    firmwareVersion: "v2.1.3",
    customer: {
      id: "CUST001",
      name: "James Ochieng",
      phone: "+254 712 345 678",
      email: "james.ochieng@email.com",
      location: "Kibera, Nairobi",
    },
    loan: {
      id: "LN001",
      amount: 25000,
      paid: 18500,
      remaining: 6500,
      monthlyPayment: 2500,
      nextPaymentDate: "2024-03-15",
      status: "Current",
    },
    specifications: {
      solarPanelWattage: "50W",
      batteryCapacity: "100Ah",
      inverterCapacity: "300W",
      usbPorts: 4,
      dcOutputs: 2,
      ledLights: 3,
    },
    recentActivities: [
      {
        id: 1,
        type: "sync",
        message: "Device synchronized successfully",
        timestamp: "2024-03-01 14:30",
        status: "success",
      },
      {
        id: 2,
        type: "payment",
        message: "Payment received: KES 2,500",
        timestamp: "2024-02-28 09:15",
        status: "success",
      },
      {
        id: 3,
        type: "alert",
        message: "Low battery warning (15%)",
        timestamp: "2024-02-27 18:45",
        status: "warning",
      },
      {
        id: 4,
        type: "maintenance",
        message: "Routine maintenance completed",
        timestamp: "2024-02-25 11:20",
        status: "success",
      },
    ],
    energyUsage: [
      { date: "2024-02-25", generated: 4.2, consumed: 3.8 },
      { date: "2024-02-26", generated: 4.5, consumed: 4.1 },
      { date: "2024-02-27", generated: 3.9, consumed: 3.5 },
      { date: "2024-02-28", generated: 4.8, consumed: 4.2 },
      { date: "2024-03-01", generated: 4.1, consumed: 3.9 },
    ],
  }
}

export default function DeviceDetailPage({ deviceId }) {
  const device = getDeviceData(deviceId)
  const [isLoading, setIsLoading] = useState(false)

  const handleDeviceAction = async (action) => {
    setIsLoading(true)
    console.log(`Performing ${action} on device ${deviceId}`)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const loanProgress = (device.loan.paid / device.loan.amount) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/devices">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Devices
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{device.type}</h1>
            <p className="text-muted-foreground">{device.serialNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={device.status === "Active" ? "default" : "destructive"}>{device.status}</Badge>
          <EditDeviceModal device={device} />
        </div>
      </div>

      {/* Device Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Battery Level</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{device.batteryLevel}%</div>
            <Progress value={device.batteryLevel} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Health: {device.batteryHealth}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Generated</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{device.energyGenerated} kWh</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{device.lastSync}</div>
            <p className="text-xs text-muted-foreground">Connected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loan Progress</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loanProgress.toFixed(1)}%</div>
            <Progress value={loanProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">KES {device.loan.remaining.toLocaleString()} remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="energy">Energy Usage</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Device Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Serial Number:</span>
                      <span className="text-sm font-medium">{device.serialNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Model:</span>
                      <span className="text-sm font-medium">{device.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Install Date:</span>
                      <span className="text-sm font-medium">{device.installDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Warranty:</span>
                      <span className="text-sm font-medium">{device.warrantyExpiry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Firmware:</span>
                      <span className="text-sm font-medium">{device.firmwareVersion}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Solar Panel:</span>
                      <span className="text-sm font-medium">{device.specifications.solarPanelWattage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Battery:</span>
                      <span className="text-sm font-medium">{device.specifications.batteryCapacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Inverter:</span>
                      <span className="text-sm font-medium">{device.specifications.inverterCapacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">USB Ports:</span>
                      <span className="text-sm font-medium">{device.specifications.usbPorts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">LED Lights:</span>
                      <span className="text-sm font-medium">{device.specifications.ledLights}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="customer" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">{device.customer.name}</h3>
                      <p className="text-sm text-muted-foreground">{device.customer.id}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{device.customer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{device.customer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{device.customer.location}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Loan Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Loan Amount:</span>
                        <span className="text-sm font-medium">KES {device.loan.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Amount Paid:</span>
                        <span className="text-sm font-medium">KES {device.loan.paid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Remaining:</span>
                        <span className="text-sm font-medium">KES {device.loan.remaining.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Next Payment:</span>
                        <span className="text-sm font-medium">{device.loan.nextPaymentDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge variant={device.loan.status === "Current" ? "default" : "destructive"}>
                          {device.loan.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="energy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Energy Usage (Last 5 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Generated (kWh)</TableHead>
                        <TableHead>Consumed (kWh)</TableHead>
                        <TableHead>Efficiency</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {device.energyUsage.map((usage, index) => {
                        const efficiency = ((usage.consumed / usage.generated) * 100).toFixed(1)
                        return (
                          <TableRow key={index}>
                            <TableCell>{usage.date}</TableCell>
                            <TableCell>{usage.generated}</TableCell>
                            <TableCell>{usage.consumed}</TableCell>
                            <TableCell>{efficiency}%</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {device.recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="mt-1">
                          {activity.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {activity.status === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                          {activity.status === "error" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Actions Sidebar */}
        <DeviceQuickActions device={device} onAction={handleDeviceAction} isLoading={isLoading} />
      </div>
    </div>
  )
}
