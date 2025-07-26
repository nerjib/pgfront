"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import https from "@/services/https";

export function AddDeviceModal() {
  const [open, setOpen] = useState(false);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [formData, setFormData] = useState({
    serialNumber: "",
    deviceTypeId: "", // Changed to deviceTypeId
    customer: "",
    location: "",
    installationDate: "",
    notes: "",
  });

  useEffect(() => {
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
    fetchDeviceTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/devices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          serial_number: formData.serialNumber,
          device_type_id: formData.deviceTypeId, // Changed to device_type_id
          // customer_id: formData.customer, // Assuming customer is customer_id
          // location: formData.location,
          // installation_date: formData.installationDate,
          // notes: formData.notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to add device");
      }

      const data = await response.json();
      console.log("Device added successfully:", data);
      setOpen(false);
      setFormData({
        serialNumber: "",
        deviceTypeId: "",
        customer: "",
        location: "",
        installationDate: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error adding device:", error);
      alert(error.message);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Register Device
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register New Device</DialogTitle>
          <DialogDescription>
            Register a new PayGo device in the system. Fill in all device information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serialNumber" className="text-right">
                Serial Number
              </Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                className="col-span-3"
                placeholder="SLR-2024-001"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deviceTypeId" className="text-right">
                Device Type
              </Label>
              <Select onValueChange={(value) => handleInputChange("deviceTypeId", value)} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  {deviceTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.device_name} ({type.device_model})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* <div className="grid grid-cols-4 items-center gap-4" hidden>
              <Label htmlFor="customer" className="text-right">
                Customer
              </Label>
              <Input
                id="customer"
                value={formData.customer}
                onChange={(e) => handleInputChange("customer", e.target.value)}
                className="col-span-3"
                placeholder="Customer name or ID"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4" hidden>
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="col-span-3"
                placeholder="Nairobi, Kenya"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4" hidden>
              <Label htmlFor="installationDate" className="text-right">
                Installation Date
              </Label>
              <Input
                id="installationDate"
                type="date"
                value={formData.installationDate}
                onChange={(e) => handleInputChange("installationDate", e.target.value)}
                className="col-span-3"
                required
              />
            </div> */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="col-span-3"
                placeholder="Additional installation notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Register Device</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
