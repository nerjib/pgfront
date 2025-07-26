"use client"

import { Button } from "@/components/ui/button"
import { DollarSign } from "lucide-react"
import { RecordLoanPaymentModal } from "./modals/record-loan-payment-modal"

export function QuickRecordPayment({ loan, onPaymentRecorded, size = "sm", variant = "outline" }) {
  return (
    <RecordLoanPaymentModal
      loan={loan}
      onPaymentRecorded={onPaymentRecorded}
      trigger={
        <Button variant={variant} size={size}>
          <DollarSign className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      }
    />
  )
}
