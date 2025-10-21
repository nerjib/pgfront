"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit } from "lucide-react";
import https from "@/services/https";
import { toast } from "@/hooks/use-toast";

export function EditDealModal({ deal, onDealUpdated, deviceTypes }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ ...deal });

  useEffect(() => {
    // Format dates for the input[type=date]
    const formattedDeal = {
        ...deal,
        start_date: deal.start_date ? new Date(deal.start_date).toISOString().split('T')[0] : '',
        end_date: deal.end_date ? new Date(deal.end_date).toISOString().split('T')[0] : '',
    };
    setFormData(formattedDeal);
  }, [deal]);

  const handleFrequencyChange = (frequency) => {
    setFormData((prev) => {
      const currentFrequencies = prev.allowed_payment_frequencies || [];
      if (currentFrequencies.includes(frequency)) {
        return { ...prev, allowed_payment_frequencies: currentFrequencies.filter(f => f !== frequency) };
      } else {
        return { ...prev, allowed_payment_frequencies: [...currentFrequencies, frequency] };
      }
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/deals/${deal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to update deal");
      }

      toast({ title: "Success", description: "Deal updated successfully." });
      setOpen(false);
      if (onDealUpdated) {
        onDealUpdated();
      }
    } catch (error) {
      console.error("Error updating deal:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Deal</DialogTitle>
          <DialogDescription>Update the details of the promotional deal.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deal_name">Deal Name</Label>
              <Input id="deal_name" value={formData.deal_name} onChange={(e) => handleInputChange("deal_name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="device_type_id">Device Type</Label>
              <Select onValueChange={(value) => handleInputChange("device_type_id", value)} value={formData.device_type_id} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a device type" />
                </SelectTrigger>
                <SelectContent>
                  {deviceTypes.map(dt => (
                    <SelectItem key={dt.id} value={dt.id}>{dt.device_name} ({dt.device_model})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Allowed Payment Frequencies</Label>
              <div className="flex items-center space-x-4">
                {["daily", "weekly", "monthly"].map(freq => (
                  <div key={freq} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`edit-${freq}`}
                      checked={formData.allowed_payment_frequencies?.includes(freq)}
                      onCheckedChange={() => handleFrequencyChange(freq)}
                    />
                    <Label htmlFor={`edit-${freq}`} className="capitalize">{freq}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input id="start_date" type="date" value={formData.start_date} onChange={(e) => handleInputChange("start_date", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input id="end_date" type="date" value={formData.end_date} onChange={(e) => handleInputChange("end_date", e.target.value)} required />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Updating..." : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
