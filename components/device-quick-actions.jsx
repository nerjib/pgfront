"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Power, RefreshCw, Ban, Download, Upload, Zap, Battery, Wifi, WifiOff } from "lucide-react"

export function DeviceQuickActions({ device, onAction, isLoading }) {
  const actionButtons = [
    {
      id: "sync",
      label: "Sync Device",
      icon: RefreshCw,
      variant: "outline",
      description: "Force sync device data",
    },
    {
      id: "reboot",
      label: "Reboot Device",
      icon: Power,
      variant: "outline",
      description: "Restart the device remotely",
    },
    {
      id: "enable",
      label: "Enable Device",
      icon: Zap,
      variant: "outline",
      description: "Enable device functionality",
      color: "text-green-600 hover:text-green-700",
    },
    {
      id: "disable",
      label: "Disable Device",
      icon: Ban,
      variant: "outline",
      description: "Disable device temporarily",
      color: "text-red-600 hover:text-red-700",
    },
  ]

  const diagnosticButtons = [
    {
      id: "battery-test",
      label: "Battery Test",
      icon: Battery,
      variant: "outline",
      description: "Run battery diagnostics",
    },
    {
      id: "connectivity-test",
      label: "Connection Test",
      icon: device.status === "Active" ? Wifi : WifiOff,
      variant: "outline",
      description: "Test device connectivity",
    },
    {
      id: "firmware-update",
      label: "Update Firmware",
      icon: Upload,
      variant: "outline",
      description: "Update device firmware",
    },
    {
      id: "download-logs",
      label: "Download Logs",
      icon: Download,
      variant: "outline",
      description: "Download device logs",
    },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Device Controls</CardTitle>
          <CardDescription>Remote device management actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {actionButtons.map((action) => (
            <Button
              key={action.id}
              variant={action.variant}
              size="sm"
              onClick={() => onAction(action.id)}
              disabled={isLoading}
              className={`w-full justify-start ${action.color || ""}`}
            >
              <action.icon className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              {action.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Diagnostics</CardTitle>
          <CardDescription>Device health and maintenance tools</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {diagnosticButtons.map((action) => (
            <Button
              key={action.id}
              variant={action.variant}
              size="sm"
              onClick={() => onAction(action.id)}
              disabled={isLoading}
              className="w-full justify-start"
            >
              <action.icon className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              {action.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Device Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Connection:</span>
            <div className="flex items-center space-x-1">
              {device.status === "Active" ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">{device.status}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Battery:</span>
            <div className="flex items-center space-x-1">
              <Battery className="h-4 w-4" />
              <span className="text-sm font-medium">{device.batteryLevel}%</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Last Sync:</span>
            <span className="text-sm font-medium">{device.lastSync}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
