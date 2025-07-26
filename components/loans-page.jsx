"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, DollarSign, Calendar, TrendingUp, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { QuickRecordPayment } from "./quick-record-payment"

const loansData = [
  {
    id: "LN001",
    customer: "James Ochieng",
    deviceId: "DEV001",
    loanAmount: 25000,
    paidAmount: 18500,
    remainingAmount: 6500,
    monthlyPayment: 2500,
    startDate: "2024-01-15",
    endDate: "2024-12-15",
    status: "Current",
    nextPaymentDate: "2024-03-15",
    daysOverdue: 0,
  },
  {
    id: "LN002",
    customer: "Sarah Wanjiru",
    deviceId: "DEV002",
    loanAmount: 45000,
    paidAmount: 22500,
    remainingAmount: 22500,
    monthlyPayment: 3750,
    startDate: "2024-01-20",
    endDate: "2025-01-20",
    status: "Current",
    nextPaymentDate: "2024-03-20",
    daysOverdue: 0,
  },
  {
    id: "LN003",
    customer: "David Kiprop",
    deviceId: "DEV003",
    loanAmount: 30000,
    paidAmount: 15000,
    remainingAmount: 15000,
    monthlyPayment: 2500,
    startDate: "2024-01-10",
    endDate: "2024-12-10",
    status: "Overdue",
    nextPaymentDate: "2024-02-10",
    daysOverdue: 15,
  },
  {
    id: "LN004",
    customer: "Mary Nyong'o",
    deviceId: "DEV004",
    loanAmount: 35000,
    paidAmount: 35000,
    remainingAmount: 0,
    monthlyPayment: 2917,
    startDate: "2023-08-01",
    endDate: "2024-08-01",
    status: "Completed",
    nextPaymentDate: "N/A",
    daysOverdue: 0,
  },
]

export default function LoansPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Loans</h1>
          <p className="text-muted-foreground">Manage customer loans and payment schedules</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Loan
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">71.5% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Loans</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">3.6% of active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Portfolio</CardTitle>
          <CardDescription>Track loan performance and payment schedules</CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search loans..." className="pl-8" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Loan Amount</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Payment</TableHead>
                <TableHead>Monthly Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loansData.map((loan) => {
                const progressPercentage = (loan.paidAmount / loan.loanAmount) * 100
                return (
                  <TableRow key={loan.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{loan.id}</div>
                        <div className="text-sm text-muted-foreground">{loan.deviceId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{loan.customer}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">KES {loan.loanAmount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          Remaining: KES {loan.remainingAmount.toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Progress value={progressPercentage} className="w-[60px]" />
                        <div className="text-xs text-muted-foreground">{progressPercentage.toFixed(1)}%</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          loan.status === "Current"
                            ? "default"
                            : loan.status === "Overdue"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {loan.status}
                        {loan.daysOverdue > 0 && ` (${loan.daysOverdue}d)`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {loan.nextPaymentDate}
                      </div>
                    </TableCell>
                    <TableCell>KES {loan.monthlyPayment.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/loans/${loan.id}`}>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </Link>
                        <QuickRecordPayment
                          loan={{
                            id: loan.id,
                            loanNumber: loan.id,
                            customer: { name: loan.customer },
                            loanDetails: {
                              remainingAmount: loan.remainingAmount,
                              monthlyPayment: loan.monthlyPayment,
                              nextPaymentDate: loan.nextPaymentDate,
                              status: loan.status,
                            },
                          }}
                          onPaymentRecorded={(paymentData) => {
                            console.log("Payment recorded for loan:", loan.id, paymentData)
                            // Handle payment recording - refresh data, show success message, etc.
                          }}
                          size="sm"
                          variant="default"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
