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
import { Plus } from "lucide-react"
import https from "@/services/https"

export function AddAgentModal({ onAgentAdded }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    state: "",
    city: "",
    address: "",
    landmark: "",
    gps: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/admin/create-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to add agent");
      }

      const data = await response.json();
      console.log("Agent added successfully:", data);
      if (onAgentAdded) {
        onAgentAdded();
      }
      setOpen(false);
      setFormData({
        username: "",
        email: "",
        password: "",
        phone_number: "",
        state: "",
        city: "",
        address: "",
        landmark: "",
        gps: "",
      });
    } catch (error) {
      console.error("Error adding agent:", error);
      alert(error.message); // Simple alert for error feedback
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
          Add Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Agent</DialogTitle>
          <DialogDescription>
            Add a new field agent to your PayGo system. Fill in all required information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="col-span-3"
                placeholder="new_agent"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="col-span-3"
                placeholder="new.agent@example.com"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="col-span-3"
                placeholder="agentpassword"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone_number" className="text-right">
                Phone Number
              </Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => handleInputChange("phone_number", e.target.value)}
                className="col-span-3"
                placeholder="+254700112233"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="state" className="text-right">
                State
              </Label>
              <Select onValueChange={(value) => handleInputChange("state", value)} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Abia">Abia</SelectItem>
                  <SelectItem value="Adamawa">Adamawa</SelectItem>
                  <SelectItem value="Akwa Ibom">Akwa Ibom</SelectItem>
                  <SelectItem value="Anambra">Anambra</SelectItem>
                  <SelectItem value="Bauchi">Bauchi</SelectItem>
                  <SelectItem value="Bayelsa">Bayelsa</SelectItem>
                  <SelectItem value="Benue">Benue</SelectItem>
                  <SelectItem value="Borno">Borno</SelectItem>
                  <SelectItem value="Cross River">Cross River</SelectItem>
                  <SelectItem value="Delta">Delta</SelectItem>
                  <SelectItem value="Ebonyi">Ebonyi</SelectItem>
                  <SelectItem value="Edo">Edo</SelectItem>
                  <SelectItem value="Ekiti">Ekiti</SelectItem>
                  <SelectItem value="Enugu">Enugu</SelectItem>
                  <SelectItem value="Gombe">Gombe</SelectItem>
                  <SelectItem value="Imo">Imo</SelectItem>
                  <SelectItem value="Jigawa">Jigawa</SelectItem>
                  <SelectItem value="Kaduna">Kaduna</SelectItem>
                  <SelectItem value="Kano">Kano</SelectItem>
                  <SelectItem value="Katsina">Katsina</SelectItem>
                  <SelectItem value="Kebbi">Kebbi</SelectItem>
                  <SelectItem value="Kogi">Kogi</SelectItem>
                  <SelectItem value="Kwara">Kwara</SelectItem>
                  <SelectItem value="Lagos">Lagos</SelectItem>
                  <SelectItem value="Nasarawa">Nasarawa</SelectItem>
                  <SelectItem value="Niger">Niger</SelectItem>
                  <SelectItem value="Ogun">Ogun</SelectItem>
                  <SelectItem value="Ondo">Ondo</SelectItem>
                  <SelectItem value="Osun">Osun</SelectItem>
                  <SelectItem value="Oyo">Oyo</SelectItem>
                  <SelectItem value="Plateau">Plateau</SelectItem>
                  <SelectItem value="Rivers">Rivers</SelectItem>
                  <SelectItem value="Sokoto">Sokoto</SelectItem>
                  <SelectItem value="Taraba">Taraba</SelectItem>
                  <SelectItem value="Yobe">Yobe</SelectItem>
                  <SelectItem value="Zamfara">Zamfara</SelectItem>
                  <SelectItem value="FCT">FCT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="col-span-3"
                placeholder="Kisumu"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="col-span-3"
                placeholder="789 Lake St"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="landmark" className="text-right">
                Landmark
              </Label>
              <Input
                id="landmark"
                value={formData.landmark}
                onChange={(e) => handleInputChange("landmark", e.target.value)}
                className="col-span-3"
                placeholder="Near Lake Victoria"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gps" className="text-right">
                GPS Coordinates
              </Label>
              <Input
                id="gps"
                value={formData.gps}
                onChange={(e) => handleInputChange("gps", e.target.value)}
                className="col-span-3"
                placeholder="-0.1022, 34.7679"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Agent</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
