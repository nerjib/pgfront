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
import https from "@/services/https";
import { Edit } from "lucide-react"

export function EditDeviceTypeModal({ deviceType, onDeviceTypeUpdated }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    device_name: deviceType?.device_name || "",
    manufacturer: deviceType?.manufacturer || "",
    device_model: deviceType?.device_model || "",
    amount: deviceType?.amount || "",
  })

  useEffect(() => {
    if (deviceType) {
      setFormData({
        device_name: deviceType.device_name || "",
        manufacturer: deviceType.manufacturer || "",
        device_model: deviceType.device_model || "",
        amount: deviceType.amount || "",
      });
    }
  }, [deviceType]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/device-types/${deviceType.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to update device type");
      }

      const data = await response.json();
      console.log("Device type updated successfully:", data);
      if (onDeviceTypeUpdated) {
        onDeviceTypeUpdated();
      }
      setOpen(false);
    } catch (error) {
      console.error("Error updating device type:", error);
      alert(error.message); // Simple alert for error feedback
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Device Type</DialogTitle>
          <DialogDescription>
            Edit the details of the device type.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="device_name" className="text-right">
                Device Name
              </Label>
              <Input
                id="device_name"
                value={formData.device_name}
                onChange={(e) => handleInputChange("device_name", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="manufacturer" className="text-right">
                Manufacturer
              </Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => handleInputChange("manufacturer", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="device_model" className="text-right">
                Device Model
              </Label>
              <Input
                id="device_model"
                value={formData.device_model}
                onChange={(e) => handleInputChange("device_model", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
