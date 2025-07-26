"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  MessageSquare,
  Phone,
  Calendar,
  AlertTriangle,
  Ban,
  RefreshCw,
  FileText,
  CreditCard,
  Clock,
} from "lucide-react"
import { RecordLoanPaymentModal } from "./modals/record-loan-payment-modal"

export function LoanQuickActions({ loan, onAction, isLoading }) {
  const paymentActions = [
    {
      id: "record-payment",
      label: "Record Payment",
      icon: DollarSign,
      variant: "default",
      description: "Record a new payment",
      color: "text-green-600 hover:text-green-700",
      component: RecordLoanPaymentModal,
    },
    {
      id: "send-reminder",
      label: "Send Reminder",
      icon: MessageSquare,
      variant: "outline",
      description: "Send payment reminder",
    },
    {
      id: "call-customer",
      label: "Call Customer",
      icon: Phone,
      variant: "outline",
      description: "Contact customer",
    },
    {
      id: "reschedule",
      label: "Reschedule Payment",
      icon: Calendar,
      variant: "outline",
      description: "Adjust payment schedule",
    },
  ]

  const managementActions = [
    {
      id: "restructure",
      label: "Restructure Loan",
      icon: RefreshCw,
      variant: "outline",
      description: "Modify loan terms",
      color: "text-blue-600 hover:text-blue-700",
    },
    {
      id: "generate-statement",
      label: "Generate Statement",
      icon: FileText,
      variant: "outline",
      description: "Create loan statement",
    },
    {
      id: "mark-default",
      label: "Mark as Default",
      icon: AlertTriangle,
      variant: "outline",
      description: "Mark loan as defaulted",
      color: "text-red-600 hover:text-red-700",
    },
    {
      id: "close-loan",
      label: "Close Loan",
      icon: Ban,
      variant: "outline",
      description: "Close completed loan",
      color: "text-gray-600 hover:text-gray-700",
    },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Payment Actions</CardTitle>
          <CardDescription>Manage payments and customer communication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {paymentActions.map((action) => {
            if (action.component) {
              const ModalComponent = action.component
              return (
                <ModalComponent
                  key={action.id}
                  loan={loan}
                  onPaymentRecorded={(paymentData) => {
                    console.log("Payment recorded:", paymentData)
                    onAction(action.id, paymentData)
                  }}
                  trigger={
                    <Button
                      variant={action.variant}
                      size="sm"
                      disabled={isLoading}
                      className={`w-full justify-start ${action.color || ""}`}
                    >
                      <action.icon className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                      {action.label}
                    </Button>
                  }
                />
              )
            }

            return (
              <Button
                key={action.id}
                variant={action.variant}
                size="sm"
                onClick={() => onAction(action.id)}
                disabled={isLoading}
                className={`w-full justify-start ${action.color || ""}`}
              >
                <action.icon className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                {action.label}
              </Button>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loan Management</CardTitle>
          <CardDescription>Advanced loan management tools</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {managementActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant}
              size="sm"
              onClick={() => onAction(action.id)}
              disabled={isLoading}
              className={`w-full justify-start ${action.color || ""}`}
            >
              <action.icon className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              {action.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loan Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status:</span>
            <div className="flex items-center space-x-1">
              {loan.loanDetails.status === "Current" ? (
                <CreditCard className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">{loan.loanDetails.status}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Progress:</span>
            <span className="text-sm font-medium">
              {((loan.loanDetails.paidAmount / loan.loanDetails.totalAmount) * 100).toFixed(1)}%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Next Payment:</span>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{loan.loanDetails.nextPaymentDate}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Remaining:</span>
            <span className="text-sm font-medium">KES {loan.loanDetails.remainingAmount.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
