"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import https from "@/services/https";
import { AddDealModal } from "./modals/add-deal-modal";
import { EditDealModal } from "./modals/edit-deal-modal";

export function DealsList() {
  const [deals, setDeals] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [dealsRes, deviceTypesRes] = await Promise.all([
        fetch(`${https.baseUrl}/deals`, { headers: { "x-auth-token": token } }),
        fetch(`${https.baseUrl}/device-types`, { headers: { "x-auth-token": token } }),
      ]);

      if (!dealsRes.ok) throw new Error("Failed to fetch deals");
      if (!deviceTypesRes.ok) throw new Error("Failed to fetch device types");

      const dealsData = await dealsRes.json();
      const deviceTypesData = await deviceTypesRes.json();
      console.log({deviceTypesData})
      setDeals(dealsData);
      setDeviceTypes(deviceTypesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error display
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDeviceTypeName = (typeId) => {
    const deviceType = deviceTypes.find(dt => dt.id === typeId);
    return deviceType ? `${deviceType.device_name} (${deviceType.device_model})` : "Unknown";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Deals</CardTitle>
            <CardDescription>Manage promotional deals for devices.</CardDescription>
          </div>
          <AddDealModal onDealAdded={fetchData} deviceTypes={deviceTypes} />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Deal Name</TableHead>
              <TableHead>Device Type</TableHead>
              <TableHead>Allowed Frequencies</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : deals.length > 0 ? (
              deals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell>{deal.deal_name}</TableCell>
                  <TableCell>{getDeviceTypeName(deal.device_type_id)}</TableCell>
                  <TableCell>{deal.allowed_payment_frequencies.join(", ")}</TableCell>
                  <TableCell>{new Date(deal.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(deal.end_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <EditDealModal deal={deal} onDealUpdated={fetchData} deviceTypes={deviceTypes} />
                    <Button variant="destructive" size="sm" className="ml-2">Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No deals found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
