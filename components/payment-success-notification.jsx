"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PaymentSuccessNotification({ payment, onClose, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 w-96">
      <Card className="border-green-200 bg-green-50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-green-900">Payment Recorded Successfully!</h4>
                <div className="mt-2 text-sm text-green-800 space-y-1">
                  <p>Amount: NGN {Number.parseFloat(payment.amount).toLocaleString()}</p>
                  <p>Method: {payment.paymentMethod}</p>
                  {payment.reference && <p>Reference: {payment.reference}</p>}
                  <p>Date: {payment.paymentDate}</p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false)
                setTimeout(onClose, 300)
              }}
              className="text-green-600 hover:text-green-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
