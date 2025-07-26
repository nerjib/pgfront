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
import { Edit } from "lucide-react"

export function EditLoanModal({ loan, onUpdate }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    principalAmount: loan?.loanDetails?.principalAmount || "",
    interestRate: loan?.loanDetails?.interestRate || "",
    termMonths: loan?.loanDetails?.termMonths || "",
    monthlyPayment: loan?.loanDetails?.monthlyPayment || "",
    status: loan?.loanDetails?.status || "Current",
    nextPaymentDate: loan?.loanDetails?.nextPaymentDate || "",
    collateral: loan?.loanDetails?.collateral || "",
    notes: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Updating loan:", formData)
    if (onUpdate) {
      onUpdate(formData)
    }
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
                <Label htmlFor="principalAmount">Principal Amount (NGN) *</Label>
                <Input
                  id="principalAmount"
                  type="number"
                  value={formData.principalAmount}
                  onChange={(e) => handleInputChange("principalAmount", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%) *</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={(e) => handleInputChange("interestRate", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Loan Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Current">Current</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="Restructured">Restructured</SelectItem>
                    <SelectItem value="Defaulted">Defaulted</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="collateral">Collateral</Label>
              <Input
                id="collateral"
                value={formData.collateral}
                onChange={(e) => handleInputChange("collateral", e.target.value)}
                placeholder="Loan collateral description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional loan notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Loan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
