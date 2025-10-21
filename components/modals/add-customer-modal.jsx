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
import { nigeriaData } from "@/lib/nigeria-data"

export function AddCustomerModal({ onCustomerAdded }) {
  const [open, setOpen] = useState(false)
  const [lgas, setLgas] = useState([]);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [usernameFeedback, setUsernameFeedback] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "", // Customers also need a password for login
    phone_number: "",
    id_number: "",
    state: "",
    city: "",
    address: "",
    landmark: "",
    gps: "",
    occupation: "",
    monthly_income: "",
    referred_by: "",
    notes: "",
    credit_score: 0, // Default credit score
    status: "Active", // Default status
  })

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
    e.preventDefault()
    if (usernameAvailable === false) {
        alert("Username is not available. Please choose another one.");
        return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: "customer", 
          phone_number: formData.phone_number,
          state: formData.state,
          city: formData.city,
          address: formData.address,
          landmark: formData.landmark,
          gps: formData.gps,
          id_number: formData.id_number,
          occupation: formData.occupation,
          monthly_income: parseFloat(formData.monthly_income),
          referred_by: formData.referred_by,
          notes: formData.notes,
          credit_score: parseInt(formData.credit_score),
          status: formData.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to add customer");
      }

      const data = await response.json();
      console.log("Customer added successfully:", data);
      if (onCustomerAdded) {
        onCustomerAdded();
      }
      setOpen(false);
      setFormData({
        username: "",
        email: "",
        password: "",
        phone_number: "",
        id_number: "",
        state: "",
        city: "",
        address: "",
        landmark: "",
        gps: "",
        occupation: "",
        monthly_income: "",
        referred_by: "",
        notes: "",
        credit_score: 0,
        status: "New",
        role: "customer",
      });
    } catch (error) {
      console.error("Error adding customer:", error);
      alert(error.message); // Simple alert for error feedback
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
        const newFormData = { ...prev, [field]: value };
        if (field === 'state') {
            newFormData.city = ""; // Reset city when state changes
        }
        return newFormData;
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Register a new customer in system. Fill in all required information for KYC compliance.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[500px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="john.doe"
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
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="john doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john.doe@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="password123"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number *</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange("phone_number", e.target.value)}
                  placeholder="+234 712 345 678"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="id_number">National ID Number *</Label>
              <Input
                id="id_number"
                value={formData.id_number}
                onChange={(e) => handleInputChange("id_number", e.target.value)}
                placeholder="12345678"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select onValueChange={(value) => handleInputChange("state", value)} value={formData.state} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {nigeriaData.map((item) => (
                        <SelectItem key={item.state} value={item.state}>{item.state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City (LGA) *</Label>
                <Select onValueChange={(value) => handleInputChange("city", value)} value={formData.city} required disabled={!formData.state}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                        {lgas.map(lga => (
                            <SelectItem key={lga} value={lga}>{lga}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="123 Main St"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="landmark">Landmark</Label>
                <Input
                  id="landmark"
                  value={formData.landmark}
                  onChange={(e) => handleInputChange("landmark", e.target.value)}
                  placeholder="Near City Mall"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gps">GPS Coordinates</Label>
                <Input
                  id="gps"
                  value={formData.gps}
                  onChange={(e) => handleInputChange("gps", e.target.value)}
                  placeholder="1.2921, 36.8219"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                  placeholder="Small business owner"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_income">Monthly Income (NGN)</Label>
                <Input
                  id="monthly_income"
                  type="number"
                  value={formData.monthly_income}
                  onChange={(e) => handleInputChange("monthly_income", e.target.value)}
                  placeholder="15000"
                />
              </div>
            </div>

            {/* <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credit_score">Credit Score</Label>
                <Input
                  id="credit_score"
                  type="number"
                  value={formData.credit_score}
                  onChange={(e) => handleInputChange("credit_score", e.target.value)}
                  placeholder="700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => handleInputChange("status", value)} value={formData.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referred_by">Referred By</Label>
              <Input
                id="referred_by"
                value={formData.referred_by}
                onChange={(e) => handleInputChange("referred_by", e.target.value)}
                placeholder="Agent name or customer reference"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional information about the customer..."
                rows={3}
              />
            </div> */}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={usernameAvailable === false || isCheckingUsername}>Add Customer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
