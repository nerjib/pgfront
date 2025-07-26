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
import { DollarSign } from "lucide-react"
import https from "@/services/https";
import { toast } from "@/hooks/use-toast";

export function RecordLoanPaymentModal({ customerId }) {
  const [amount, setAmount] = useState("");
  const [loanId, setLoanId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRecordPayment = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/loans/${loanId}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ amount: parseFloat(amount), customerId }),
      });

      if (!response.ok) {
        throw new Error("Failed to record payment");
      }

      toast({
        title: "Payment Recorded",
        description: `Successfully recorded NGN ${amount} for loan ${loanId}.`,
      });
      setAmount("");
      setLoanId("");
      // Optionally, refresh customer/loan data on parent component
    } catch (error) {
      console.error("Error recording payment:", error);
      toast({
        title: "Payment Failed",
        description: "There was an error recording the payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <DollarSign className="mr-2 h-4 w-4" />
          Record Loan Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Loan Payment</DialogTitle>
          <DialogDescription>
            Enter the amount and loan ID to record a payment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="loanId" className="text-right">
              Loan ID
            </Label>
            <Input
              id="loanId"
              value={loanId}
              onChange={(e) => setLoanId(e.target.value)}
              className="col-span-3"
              placeholder="e.g., LOAN123"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 5000"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleRecordPayment} disabled={isLoading}>
            {isLoading ? "Recording..." : "Record Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}