
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
import { Edit } from "lucide-react"
import https from "@/services/https"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function EditSuperAgentModal({ superAgent, onUpdate }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    state: "",
    city: "",
    address: "",
    landmark: "",
    gps: "",
    commission_rate: null, // Use null to indicate general commission
    use_custom_commission: false,
    status: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (superAgent) {
      setFormData({
        name: superAgent.name || "",
        email: superAgent.email || "",
        phone_number: superAgent.phone || "",
        state: superAgent.region || "",
        city: superAgent.city || "",
        address: superAgent.address || "",
        landmark: superAgent.landmark || "",
        gps: superAgent.gps || "",
        commission_rate: superAgent.commissionRate === null ? null : superAgent.commissionRate,
        use_custom_commission: superAgent.commissionRate !== null,
        status: superAgent.status || "",
      })
    }
  }, [superAgent])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSelectChange = (value, id) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const payload = {
        ...formData,
        commission_rate: formData.use_custom_commission ? parseFloat(formData.commission_rate) : null,
      };
      delete payload.use_custom_commission;

      const response = await fetch(`${https.baseUrl}/admin/super-agent/${superAgent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.msg || "Failed to update super-agent")
      }

      toast({
        title: "Super-Agent Updated",
        description: "Super-agent information updated successfully.",
      })
      onUpdate()
    } catch (error) {
      console.error("Error updating super-agent:", error)
      toast({
        title: "Update Failed",
        description: error.message || "There was an error updating the super-agent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit Super-Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Super-Agent</DialogTitle>
          <DialogDescription>Make changes to super-agent profile here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              name
            </Label>
            <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" value={formData.email} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone_number" className="text-right">
              Phone
            </Label>
            <Input id="phone_number" value={formData.phone_number} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="state" className="text-right">
              State
            </Label>
            <Input id="state" value={formData.state} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right">
              City
            </Label>
            <Input id="city" value={formData.city} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input id="address" value={formData.address} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="landmark" className="text-right">
              Landmark
            </Label>
            <Input id="landmark" value={formData.landmark} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gps" className="text-right">
              GPS
            </Label>
            <Input id="gps" value={formData.gps} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="commission_rate" className="text-right">
                Commission Type
              </Label>
              <Select
                value={formData.use_custom_commission ? "custom" : "general"}
                onValueChange={(value) =>
                  handleSelectChange(value === "custom", "use_custom_commission")
                }
                className="col-span-3"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select commission type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Commission</SelectItem>
                  <SelectItem value="custom">Custom Commission</SelectItem>
                </SelectContent>
              </Select>
            </div>
          {formData.use_custom_commission && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="commission_rate" className="text-right">
                Custom Rate (%)
              </Label>
              <Input
                id="commission_rate"
                type="number"
                value={formData.commission_rate || ""}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Enter custom rate"
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange(value, "status")}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
