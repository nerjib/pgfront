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
import { Edit } from "lucide-react"
import https from "@/services/https";
import { toast } from "@/hooks/use-toast";

export function EditLoanModal({ loan, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    totalAmount: loan?.totalAmount || "",
    termMonths: loan?.termMonths || "",
    monthlyPayment: loan?.monthlyPayment || "",
    status: loan?.status || "Current",
    nextPaymentDate: loan?.nextPaymentDate ? new Date(loan.nextPaymentDate).toISOString().split('T')[0] : "",
    guarantor_name: loan?.guarantorDetails?.name || "",
    guarantor_phone: loan?.guarantorDetails?.phone || "",
    guarantor_address: loan?.guarantorDetails?.address || "",
  });

  useEffect(() => {
    if (loan) {
      setFormData({
        totalAmount: loan.totalAmount || "",
        termMonths: loan.termMonths || "",
        monthlyPayment: loan.monthlyPayment || "",
        status: loan.status || "Current",
        nextPaymentDate: loan.nextPaymentDate ? new Date(loan.nextPaymentDate).toISOString().split('T')[0] : "",
        guarantor_name: loan.guarantorDetails?.name || "",
        guarantor_phone: loan.guarantorDetails?.phone || "",
        guarantor_address: loan.guarantorDetails?.address || "",
      });
    }
  }, [loan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let parsedGuarantorDetails = null;
      if (formData.guarantorDetails) {
        try {
          parsedGuarantorDetails = JSON.parse(formData.guarantorDetails);
        } catch (jsonError) {
          throw new Error("Invalid JSON for guarantor details.");
        }
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/loans/${loan.loan_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          total_amount: parseFloat(formData.totalAmount),
          term_months: parseInt(formData.termMonths),
          monthly_payment: parseFloat(formData.monthlyPayment),
          status: formData.status,
          next_payment_date: formData.nextPaymentDate,
          guarantor_details: {
            name: formData.guarantor_name,
            phone: formData.guarantor_phone,
            address: formData.guarantor_address,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to update loan");
      }

      toast({
        title: "Loan Updated",
        description: `Loan ${loan.loan_id} has been updated successfully.`,
      });
      setOpen(false);
      if (onUpdate) {
        onUpdate(); // Trigger refresh in parent component
      }
    } catch (error) {
      console.error("Error updating loan:", error);
      toast({
        title: "Update Failed",
        description: error.message || "There was an error updating the loan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
          <Edit className="mr-2 h-4 w-4" />
          Edit Loan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Loan Information</DialogTitle>
          <DialogDescription>Update loan terms and payment details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[500px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Amount (NGN) *</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => handleInputChange("totalAmount", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="termMonths">Term (Months) *</Label>
                <Input
                  id="termMonths"
                  type="number"
                  value={formData.termMonths}
                  onChange={(e) => handleInputChange("termMonths", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyPayment">Monthly Payment (NGN) *</Label>
                <Input
                  id="monthlyPayment"
                  type="number"
                  value={formData.monthlyPayment}
                  onChange={(e) => handleInputChange("monthlyPayment", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Loan Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="defaulted">Defaulted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextPaymentDate">Next Payment Date</Label>
              <Input
                id="nextPaymentDate"
                type="date"
                value={formData.nextPaymentDate}
                onChange={(e) => handleInputChange("nextPaymentDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guarantor_name">Guarantor Name</Label>
              <Input
                id="guarantor_name"
                value={formData.guarantor_name}
                onChange={(e) => handleInputChange("guarantor_name", e.target.value)}
                placeholder="Guarantor's Full Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guarantor_phone">Guarantor Phone</Label>
              <Input
                id="guarantor_phone"
                value={formData.guarantor_phone}
                onChange={(e) => handleInputChange("guarantor_phone", e.target.value)}
                placeholder="Guarantor's Phone Number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guarantor_address">Guarantor Address</Label>
              <Input
                id="guarantor_address"
                value={formData.guarantor_address}
                onChange={(e) => handleInputChange("guarantor_address", e.target.value)}
                placeholder="Guarantor's Address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Loan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
