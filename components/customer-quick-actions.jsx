"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RecordLoanPaymentModal } from "./modals/record-loan-payment-modal"
import {
  MessageSquare,
  Phone,
  Mail,
  CreditCard,
  FileText,
  AlertTriangle,
  UserCheck,
  Ban,
  TrendingUp,
  Calendar,
} from "lucide-react"

export function CustomerQuickActions({ customer, onAction, isLoading }) {
  const communicationActions = [
    {
      id: "call-customer",
      label: "Call Customer",
      icon: Phone,
      variant: "outline",
      description: "Contact customer by phone",
    },
    {
      id: "send-sms",
      label: "Send SMS",
      icon: MessageSquare,
      variant: "outline",
      description: "Send SMS message",
    },
    {
      id: "send-email",
      label: "Send Email",
      icon: Mail,
      variant: "outline",
      description: "Send email notification",
    },
    {
      id: "schedule-visit",
      label: "Schedule Visit",
      icon: Calendar,
      variant: "outline",
      description: "Schedule field visit",
    },
  ]

  const managementActions = [
    {
      id: "record-loan-payment",
      label: "Record Loan Payment",
      icon: CreditCard,
      variant: "outline",
      description: "Record a payment for a loan",
      component: RecordLoanPaymentModal,
    },
    {
      id: "update-credit",
      label: "Update Credit Score",
      icon: CreditCard,
      variant: "outline",
      description: "Recalculate credit score",
      color: "text-blue-600 hover:text-blue-700",
    },
    {
      id: "generate-report",
      label: "Generate Report",
      icon: FileText,
      variant: "outline",
      description: "Create customer report",
    },
    {
      id: "flag-risk",
      label: "Flag as Risk",
      icon: AlertTriangle,
      variant: "outline",
      description: "Mark as high risk",
      color: "text-red-600 hover:text-red-700",
    },
    {
      id: "suspend-account",
      label: "Suspend Account",
      icon: Ban,
      variant: "outline",
      description: "Temporarily suspend",
      color: "text-red-600 hover:text-red-700",
    },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Communication</CardTitle>
          <CardDescription>Contact and schedule customer interactions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {communicationActions.map((action) => (
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
          <CardTitle>Account Management</CardTitle>
          <CardDescription>Customer account and risk management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {managementActions.map((action) => (
            action.component ? (
              <action.component key={action.id} customerId={customer.id} />
            ) : (
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
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status:</span>
            <div className="flex items-center space-x-1">
              {customer?.creditInfo?.status === "Active" ? (
                <UserCheck className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">{customer?.creditInfo?.status}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Credit Score:</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">{customer?.creditInfo?.creditScore}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Risk Level:</span>
            <span className="text-sm font-medium">{customer?.creditInfo?.riskLevel}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Member Since:</span>
            <span className="text-sm font-medium">{customer?.creditInfo?.joinDate}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
