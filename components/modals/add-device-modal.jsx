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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

export function AddDeviceModal() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    serialNumber: "",
    deviceType: "",
    model: "",
    customer: "",
    location: "",
    installationDate: "",
    notes: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Adding device:", formData)
    // Reset form and close modal
    setFormData({
      serialNumber: "",
      deviceType: "",
      model: "",
      customer: "",
      location: "",
      installationDate: "",
      notes: "",
    })
    setOpen(false)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

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
              <Label htmlFor="deviceType" className="text-right">
                Device Type
              </Label>
              <Select onValueChange={(value) => handleInputChange("deviceType", value)} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solar-home-system">Solar Home System</SelectItem>
                  <SelectItem value="water-pump">Water Pump</SelectItem>
                  <SelectItem value="solar-lantern">Solar Lantern</SelectItem>
                  <SelectItem value="cooking-stove">Cooking Stove</SelectItem>
                  <SelectItem value="tv-system">TV System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Model
              </Label>
              <Select onValueChange={(value) => handleInputChange("model", value)} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SHS-50W">SHS-50W</SelectItem>
                  <SelectItem value="SHS-100W">SHS-100W</SelectItem>
                  <SelectItem value="SHS-200W">SHS-200W</SelectItem>
                  <SelectItem value="WP-500L">WP-500L</SelectItem>
                  <SelectItem value="WP-1000L">WP-1000L</SelectItem>
                  <SelectItem value="SL-20W">SL-20W</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
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
            <div className="grid grid-cols-4 items-center gap-4">
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
            <div className="grid grid-cols-4 items-center gap-4">
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
            </div>
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
  )
}
