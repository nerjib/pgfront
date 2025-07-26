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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DollarSign, Calculator, AlertTriangle, CheckCircle, CreditCard } from "lucide-react"

export function RecordLoanPaymentModal({ loan, onPaymentRecorded, trigger }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    amount: loan?.loanDetails?.monthlyPayment || "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "",
    reference: "",
    lateFee: 0,
    earlyPaymentDiscount: 0,
    notes: "",
    isPartialPayment: false,
  })

  const [calculatedValues, setCalculatedValues] = useState({
    principalAmount: 0,
    interestAmount: 0,
    totalWithFees: 0,
    remainingBalance: 0,
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const paymentData = {
      ...formData,
      ...calculatedValues,
      loanId: loan?.id,
      customerId: loan?.customer?.id,
      timestamp: new Date().toISOString(),
    }

    console.log("Recording payment:", paymentData)

    if (onPaymentRecorded) {
      onPaymentRecorded(paymentData)
    }

    // Reset form
    setFormData({
      amount: loan?.loanDetails?.monthlyPayment || "",
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "",
      reference: "",
      lateFee: 0,
      earlyPaymentDiscount: 0,
      notes: "",
      isPartialPayment: false,
    })

    setOpen(false)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }

      // Recalculate values when amount changes
      if (field === "amount" || field === "lateFee" || field === "earlyPaymentDiscount") {
        calculatePaymentBreakdown(newData)
      }

      return newData
    })
  }

  const calculatePaymentBreakdown = (data) => {
    const paymentAmount = Number.parseFloat(data.amount) || 0
    const lateFee = Number.parseFloat(data.lateFee) || 0
    const discount = Number.parseFloat(data.earlyPaymentDiscount) || 0

    // Simple calculation - in real app, this would be more complex
    const monthlyInterest = (loan?.loanDetails?.remainingAmount * (loan?.loanDetails?.interestRate / 100)) / 12
    const interestAmount = Math.min(monthlyInterest, paymentAmount)
    const principalAmount = Math.max(0, paymentAmount - interestAmount)
    const totalWithFees = paymentAmount + lateFee - discount
    const remainingBalance = Math.max(0, loan?.loanDetails?.remainingAmount - principalAmount)

    setCalculatedValues({
      principalAmount: principalAmount.toFixed(2),
      interestAmount: interestAmount.toFixed(2),
      totalWithFees: totalWithFees.toFixed(2),
      remainingBalance: remainingBalance.toFixed(2),
    })
  }

  const paymentMethods = [
    { value: "mobile-money", label: "Mobile Money (M-Pesa, Airtel Money)" },
    { value: "cash", label: "Cash Payment" },
    { value: "bank-transfer", label: "Bank Transfer" },
    { value: "check", label: "Check/Cheque" },
    { value: "card", label: "Credit/Debit Card" },
    { value: "agent-collection", label: "Agent Collection" },
  ]

  const isOverpayment = Number.parseFloat(formData.amount) > loan?.loanDetails?.monthlyPayment
  const isUnderpayment =
    Number.parseFloat(formData.amount) < loan?.loanDetails?.monthlyPayment && Number.parseFloat(formData.amount) > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <DollarSign className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Loan Payment</DialogTitle>
          <DialogDescription>
            Record a new payment for loan {loan?.loanNumber} - {loan?.customer?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Loan Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Loan Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Outstanding Balance:</span>
                    <span className="font-medium">KES {loan?.loanDetails?.remainingAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Payment:</span>
                    <span className="font-medium">KES {loan?.loanDetails?.monthlyPayment?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Due Date:</span>
                    <span className="font-medium">{loan?.loanDetails?.nextPaymentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={loan?.loanDetails?.status === "Current" ? "default" : "destructive"}>
                      {loan?.loanDetails?.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Payment Amount (KES) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    placeholder="Enter payment amount"
                    required
                  />
                  {isOverpayment && (
                    <p className="text-xs text-blue-600 flex items-center">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Overpayment - will reduce future payments
                    </p>
                  )}
                  {isUnderpayment && (
                    <p className="text-xs text-yellow-600 flex items-center">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Partial payment - may incur late fees
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Payment Date *</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => handleInputChange("paymentDate", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select onValueChange={(value) => handleInputChange("paymentMethod", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reference">Transaction Reference</Label>
                  <Input
                    id="reference"
                    value={formData.reference}
                    onChange={(e) => handleInputChange("reference", e.target.value)}
                    placeholder="e.g., MP240301001, CHQ123456"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lateFee">Late Fee (KES)</Label>
                  <Input
                    id="lateFee"
                    type="number"
                    step="0.01"
                    value={formData.lateFee}
                    onChange={(e) => handleInputChange("lateFee", e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="earlyPaymentDiscount">Early Payment Discount (KES)</Label>
                <Input
                  id="earlyPaymentDiscount"
                  type="number"
                  step="0.01"
                  value={formData.earlyPaymentDiscount}
                  onChange={(e) => handleInputChange("earlyPaymentDiscount", e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Payment Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes about this payment..."
                  rows={3}
                />
              </div>
            </div>

            {/* Payment Breakdown */}
            {formData.amount && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Calculator className="mr-2 h-5 w-5" />
                    Payment Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Principal Amount:</span>
                      <span className="font-medium">
                        KES {Number.parseFloat(calculatedValues.principalAmount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Interest Amount:</span>
                      <span className="font-medium">
                        KES {Number.parseFloat(calculatedValues.interestAmount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Late Fee:</span>
                      <span className="font-medium">
                        KES {Number.parseFloat(formData.lateFee || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Early Payment Discount:</span>
                      <span className="font-medium text-green-600">
                        -KES {Number.parseFloat(formData.earlyPaymentDiscount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Total Payment:</span>
                    <span>KES {Number.parseFloat(calculatedValues.totalWithFees).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Remaining Balance After Payment:</span>
                    <span className="font-medium">
                      KES {Number.parseFloat(calculatedValues.remainingBalance).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Warnings */}
            {Number.parseFloat(calculatedValues.remainingBalance) <= 0 && formData.amount && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Loan will be fully paid with this payment!</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.amount || !formData.paymentMethod}>
              <CreditCard className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
