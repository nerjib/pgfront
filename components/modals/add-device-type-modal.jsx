"use client"

import { useState } from "react"
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
import { Plus } from "lucide-react"

export function AddDeviceTypeModal({ onDeviceTypeAdded }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    device_name: "",
    manufacturer: "",
    device_model: "",
    amount: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/device-types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to add device type");
      }

      const data = await response.json();
      console.log("Device type added successfully:", data);
      if (onDeviceTypeAdded) {
        onDeviceTypeAdded();
      }
      setOpen(false);
      setFormData({
        device_name: "",
        manufacturer: "",
        device_model: "",
        amount: "",
      });
    } catch (error) {
      console.error("Error adding device type:", error);
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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Device Type
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Device Type</DialogTitle>
          <DialogDescription>
            Add a new device type to your PayGo system. Fill in all required information.
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
                placeholder="Solar Home System"
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
                placeholder="Bright Solar"
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
                placeholder="SHS-50W"
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
                placeholder="25000.00"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Device Type</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
