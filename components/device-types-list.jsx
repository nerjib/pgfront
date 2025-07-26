"use client"

import { useState, useEffect } from "react";
import { AddDeviceTypeModal } from "./modals/add-device-type-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { EditDeviceTypeModal } from "./modals/edit-device-type-modal";
import { Filter, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import https from "@/services/https";

// ... (imports)

export function DeviceTypesList() {
  const [deviceTypes, setDeviceTypes] = useState([]);

  const fetchDeviceTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/device-types`, {
        headers: {
          "x-auth-token": token,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch device types");
      }
      const data = await response.json();
      setDeviceTypes(data);
    } catch (error) {
      console.error("Error fetching device types:", error);
    }
  };

  useEffect(() => {
    fetchDeviceTypes();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Types</CardTitle>
        <CardDescription>Manage available device types</CardDescription>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search device types..." className="pl-8" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <AddDeviceTypeModal onDeviceTypeAdded={fetchDeviceTypes} />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device Name</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deviceTypes.length > 0 ? (
              deviceTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.device_name}</TableCell>
                  <TableCell>{type.manufacturer}</TableCell>
                  <TableCell>{type.device_model}</TableCell>
                  <TableCell>NGN {parseFloat(type.amount).toLocaleString()}</TableCell>
                  <TableCell>
                    <EditDeviceTypeModal deviceType={type} onDeviceTypeUpdated={fetchDeviceTypes} />
                    <Button variant="destructive" size="sm">Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No device types found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
