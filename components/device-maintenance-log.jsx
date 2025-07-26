"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Wrench, AlertTriangle, CheckCircle, Clock } from "lucide-react"

const maintenanceRecords = [
  {
    id: 1,
    date: "2024-02-25",
    type: "Routine Maintenance",
    technician: "John Doe",
    description: "Battery health check, panel cleaning, connection inspection",
    status: "Completed",
    cost: 500,
    nextDue: "2024-05-25",
  },
  {
    id: 2,
    date: "2024-01-15",
    type: "Repair",
    technician: "Jane Smith",
    description: "Replaced faulty inverter component",
    status: "Completed",
    cost: 1200,
    nextDue: null,
  },
  {
    id: 3,
    date: "2024-03-10",
    type: "Inspection",
    technician: "Mike Johnson",
    description: "Quarterly safety inspection",
    status: "Scheduled",
    cost: 0,
    nextDue: null,
  },
]

export function DeviceMaintenanceLog({ deviceId }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Maintenance Log</CardTitle>
            <CardDescription>Device maintenance history and scheduled services</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenanceRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.date}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    <span>{record.type}</span>
                  </div>
                </TableCell>
                <TableCell>{record.technician}</TableCell>
                <TableCell className="max-w-xs truncate">{record.description}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      record.status === "Completed"
                        ? "default"
                        : record.status === "Scheduled"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {record.status === "Completed" && <CheckCircle className="mr-1 h-3 w-3" />}
                    {record.status === "Scheduled" && <Clock className="mr-1 h-3 w-3" />}
                    {record.status === "Overdue" && <AlertTriangle className="mr-1 h-3 w-3" />}
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell>{record.cost > 0 ? `KES ${record.cost.toLocaleString()}` : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
