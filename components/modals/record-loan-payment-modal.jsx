"use client"

import { useEffect, useState } from "react"
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
import Swal from "sweetalert2";


export function RecordLoanPaymentModal({ loan, onPaymentRecorded }) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleRecordPayment = async () => {
    console.log({loan})
    // if (parseFloat(amount) < loan.monthlyPayment) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Invalid Amount",
    //     text: "Amount must be at least the monthly payment of NGN " + loan.monthlyPayment.toLocaleString() + ".",
    //   })
    //   toast({
    //     title: "Payment Error",
    //     description: `Amount must be at least the monthly payment of NGN ${loan.monthlyPayment.toLocaleString()}.`,
    //     variant: "destructive",
    //   });
    //   return;
    // }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/payments/manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          user_id: loan.customer.id,
          amount: parseFloat(amount),
          loan_id: loan.id,
          payment_method: "manual",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to record payment");
      }
      
      toast({
        title: "Payment Recorded",
        description: `Successfully recorded NGN ${amount} for loan ${loan.loan_id}.`,
      });
      setAmount("");
      onPaymentRecorded();
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