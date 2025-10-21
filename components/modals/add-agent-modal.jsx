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
import { Plus } from "lucide-react"
import https from "@/services/https"
import Swal from "sweetalert2"
import { nigeriaData } from "@/lib/nigeria-data"

export function AddAgentModal({ onAgentAdded, setReload, reload }) {
  const [open, setOpen] = useState(false)
  const [lgas, setLgas] = useState([])
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [usernameFeedback, setUsernameFeedback] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    state: "",
    city: "",
    address: "",
    landmark: "",
    role: "",
    gps: "",
    name: "",
  });

  useEffect(() => {
    if (formData.state) {
      const selectedState = nigeriaData.find(item => item.state === formData.state);
      setLgas(selectedState ? selectedState.lgas : []);
    } else {
      setLgas([]);
    }
  }, [formData.state]);

  useEffect(() => {
    const checkUsername = async () => {
        if (formData.username.length < 3) {
            setUsernameAvailable(null);
            setUsernameFeedback('');
            return;
        }
        setIsCheckingUsername(true);
        setUsernameFeedback('');
        try {
            const response = await fetch(`${https.baseUrl}/auth/check-username/${formData.username}`);
            const data = await response.json();
            setUsernameAvailable(data.available);
            setUsernameFeedback(data.msg);
        } catch (error) {
            console.error("Error checking username:", error);
            setUsernameAvailable(false);
            setUsernameFeedback("Error checking username.");
        } finally {
            setIsCheckingUsername(false);
        }
    };

    const debounceTimeout = setTimeout(() => {
        if (formData.username) {
            checkUsername();
        } else {
            setUsernameAvailable(null);
            setUsernameFeedback('');
        }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [formData.username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usernameAvailable === false) {
        alert("Username is not available. Please choose another one.");
        return;
    }
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
      Swal.fire("Agent added successfully");
      setReload(!reload);
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
        name: "",
        role: "",
      });
    } catch (error) {
      console.error("Error adding agent:", error);
      alert(error.message);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [field]: value };
      if (field === 'state') {
        newFormData.city = "";
      }
      return newFormData;
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Agent</DialogTitle>
          <DialogDescription>
            Add a new field agent to your system. Fill in all required information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="username" className="text-right pt-2">
                Username
              </Label>
              <div className="col-span-3">
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="new_agent"
                  required
                  autoComplete="off"
                />
                {isCheckingUsername && <p className="text-xs text-muted-foreground mt-1">Checking...</p>}
                {!isCheckingUsername && usernameFeedback && (
                    <p className={`text-xs mt-1 ${usernameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {usernameFeedback}
                    </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="col-span-3"
                placeholder="john doe"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select onValueChange={(value) => handleInputChange("role", value)} value={formData.role} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super-agent">Super Agent</SelectItem>
                  <SelectItem value="agent">agent</SelectItem>
                </SelectContent>
              </Select>
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
                placeholder="+2348065671334"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="state" className="text-right">
                State
              </Label>
              <Select onValueChange={(value) => handleInputChange("state", value)} value={formData.state} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {nigeriaData.map((item) => (
                    <SelectItem key={item.state} value={item.state}>{item.state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                City (LGA)
              </Label>
              <Select onValueChange={(value) => handleInputChange("city", value)} value={formData.city} required disabled={!formData.state}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {lgas.map(lga => (
                    <SelectItem key={lga} value={lga}>{lga}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                placeholder="No.1 Sardauna Crescent"
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
                placeholder="Near ABS Stadium"
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
                placeholder="0.1022, 34.7679"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={usernameAvailable === false || isCheckingUsername}>
              Add Agent
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
