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
import https from "@/services/https"
import { Plus, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AddDeviceTypeModal({ onDeviceTypeAdded }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    device_name: "",
    manufacturer: "",
    device_model: "",
    pricing: [{ plan: "one-time", amount: "" }],
    category: "serialized",
    default_down_payment: "",
    token_validity_days: "",
  })
  const [pricingPlanTypes, setPricingPlanTypes] = useState(['one-time']);

  const handleSubmit = async (e) => {
    e.preventDefault()

    for (let i = 0; i < formData.pricing.length; i++) {
        if (pricingPlanTypes[i] === 'custom') {
            const months = parseInt(formData.pricing[i].plan, 10);
            if (isNaN(months) || months < 1) {
                alert(`Please enter a valid number of months (>= 1) for all custom pricing plans.`);
                return;
            }
        }
    }
    
    const pricingObject = formData.pricing.reduce((acc, curr, index) => {
      const planType = pricingPlanTypes[index];
      let planName = '';

      if (planType === 'one-time') {
          planName = 'one-time';
      } else if (planType === 'custom') {
          const months = parseInt(curr.plan, 10);
          planName = `${months}-month`;
      }

      if (planName && curr.amount) {
        acc[planName] = parseFloat(curr.amount);
      }
      return acc;
    }, {});

    const payload = {
      device_name: formData.device_name,
      manufacturer: formData.manufacturer,
      device_model: formData.device_model,
      pricing: pricingObject,
      category: formData.category,
      default_down_payment: parseFloat(formData.default_down_payment),
      token_validity_days: parseInt(formData.token_validity_days),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/device-types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(payload),
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
        pricing: [{ plan: "one-time", amount: "" }],
        category: "serialized",
        default_down_payment: "",
        token_validity_days: "",
      });
      setPricingPlanTypes(['one-time']);
    } catch (error) {
      console.error("Error adding device type:", error);
      alert(error.message);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  };

  const handlePricingChange = (index, field, value) => {
    const newPricing = [...formData.pricing];
    newPricing[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      pricing: newPricing,
    }));
  };

  const addPricingPlan = () => {
    setFormData((prev) => ({
      ...prev,
      pricing: [...prev.pricing, { plan: "", amount: "" }],
    }));
    setPricingPlanTypes(prev => [...prev, 'custom']);
  };

  const removePricingPlan = (index) => {
    const newPricing = formData.pricing.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      pricing: newPricing,
    }));
    const newTypes = pricingPlanTypes.filter((_, i) => i !== index);
    setPricingPlanTypes(newTypes);
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
              <Select onValueChange={(value) => handleInputChange("manufacturer", value)} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select manufacturer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="biolite">Biolite</SelectItem>
                  <SelectItem value="beebeejump">Beebee Jump</SelectItem>
                  <SelectItem value="solarun">Solarun</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select onValueChange={(value) => handleInputChange("category", value)} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="serialized">Serialized</SelectItem>
                  <SelectItem value="non-serialized">Non-serialized</SelectItem>
                </SelectContent>
              </Select>
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
              <Label htmlFor="default_down_payment" className="text-right">
                Default Down Payment
              </Label>
              <Input
                id="default_down_payment"
                type="number"
                value={formData.default_down_payment}
                onChange={(e) => handleInputChange("default_down_payment", e.target.value)}
                className="col-span-3"
                placeholder="e.g., 10000"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="token_validity_days" className="text-right">
                Token Validity (Days)
              </Label>
              <Input
                id="token_validity_days"
                type="number"
                value={formData.token_validity_days}
                onChange={(e) => handleInputChange("token_validity_days", e.target.value)}
                className="col-span-3"
                placeholder="e.g., 30"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="onetime_commission_rate" className="text-right">
              Onetime Commission Rate
              </Label>
              <Input
                id="onetime_commission_rate"
                type="number"
                value={formData.onetime_commission_rate}
                onChange={(e) => handleInputChange("onetime_commission_rate", e.target.value)}
                className="col-span-3"
                placeholder="e.g., 5"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Pricing
              </Label>
              <div className="col-span-3">
                {formData.pricing.map((price, index) => (
                  <div key={index} className="flex items-end gap-2 mb-2">
                    <div className="flex-1">
                      <Select 
                          onValueChange={(value) => {
                              if (value === 'one-time') {
                                  const anotherOneTimeExists = pricingPlanTypes.some((type, i) => type === 'one-time' && i !== index);
                                  if (anotherOneTimeExists) {
                                      alert("You can only have one 'one-time' pricing plan.");
                                      return;
                                  }
                              }
                              const newTypes = [...pricingPlanTypes];
                              newTypes[index] = value;
                              setPricingPlanTypes(newTypes);
                              if (value === 'one-time') {
                                  handlePricingChange(index, 'plan', 'one-time');
                              } else {
                                  handlePricingChange(index, 'plan', '');
                              }
                          }} 
                          value={pricingPlanTypes[index]}
                      >
                          <SelectTrigger>
                              <SelectValue placeholder="Select a plan type" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="one-time">One-time</SelectItem>
                              <SelectItem value="custom">Custom (in months)</SelectItem>
                          </SelectContent>
                      </Select>
                      {pricingPlanTypes[index] === 'custom' && (
                          <Input
                              type="number"
                              value={price.plan === 'one-time' ? '' : price.plan}
                              onChange={(e) => handlePricingChange(index, "plan", e.target.value)}
                              placeholder="Months"
                              className="mt-2"
                              min="1"
                              required
                          />
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        type="number"
                        value={price.amount}
                        onChange={(e) => handlePricingChange(index, "amount", e.target.value)}
                        placeholder="Amount"
                        required
                      />
                    </div>
                    {formData.pricing.length > 1 ? (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removePricingPlan(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    ) : (
                      <div className="w-10 h-10" />
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addPricingPlan}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Plan
                </Button>
              </div>
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
