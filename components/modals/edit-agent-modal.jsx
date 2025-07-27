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

export function EditAgentModal({ agent, onUpdate }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    state: "",
    city: "",
    address: "",
    landmark: "",
    gps: "",
    commission_rate: 0,
    status: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    if (agent) {
      setFormData({
        username: agent.name || "",
        email: agent.email || "",
        phone_number: agent.phone || "",
        state: agent.region || "",
        city: agent.city || "",
        address: agent.address || "",
        landmark: agent.landmark || "",
        gps: agent.gps || "",
        commission_rate: agent.commissionRate || 0,
        status: agent.status || "",
      })
    }
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]))
        setUserRole(decodedToken.user.role)
      } catch (e) {
        console.error("Error decoding token:", e)
      }
    }
  }, [agent])

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
      const response = await fetch(`${https.baseUrl}/agents/${agent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.msg || "Failed to update agent")
      }

      toast({
        title: "Agent Updated",
        description: "Agent information updated successfully.",
      })
      onUpdate()
    } catch (error) {
      console.error("Error updating agent:", error)
      toast({
        title: "Update Failed",
        description: error.message || "There was an error updating the agent. Please try again.",
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
          Edit Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Agent</DialogTitle>
          <DialogDescription>Make changes to agent profile here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value={formData.username} onChange={handleChange} className="col-span-3" />
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
          {userRole === "admin" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="commission_rate" className="text-right">
                Commission Rate
              </Label>
              <Input
                id="commission_rate"
                type="number"
                value={formData.commission_rate}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          )}
          {userRole === "admin" && (
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
          )}
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