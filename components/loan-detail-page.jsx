"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { EditLoanModal } from "./modals/edit-loan-modal"
import { LoanQuickActions } from "./loan-quick-actions"

// Mock data - replace with actual data fetching
const getLoanData = (loanId) => {
  return {
    id: loanId,
    loanNumber: "LN001",
    customer: {
      id: "CUST001",
      name: "James Ochieng",
      phone: "+254 712 345 678",
      email: "james.ochieng@email.com",
      location: "Kibera, Nairobi",
      idNumber: "12345678",
      creditScore: 85,
    },
    device: {
      id: "DEV001",
      serialNumber: "SLR-2024-001",
      type: "Solar Home System",
      model: "SHS-50W",
      status: "Active",
    },
    loanDetails: {
      principalAmount: 25000,
      interestRate: 12.5,
      termMonths: 12,
      monthlyPayment: 2500,
      totalAmount: 30000,
      paidAmount: 18500,
      remainingAmount: 11500,
      status: "Current",
      startDate: "2024-01-15",
      endDate: "2024-12-15",
      nextPaymentDate: "2024-03-15",
      daysOverdue: 0,
      collateral: "Solar Home System",
    },
    paymentHistory: [
      {
        id: 1,
        date: "2024-02-28",
        amount: 2500,
        method: "Mobile Money",
        reference: "MP240228001",
        status: "Completed",
        lateFee: 0,
      },
      {
        id: 2,
        date: "2024-01-28",
        amount: 2500,
        method: "Mobile Money",
        reference: "MP240128001",
        status: "Completed",
        lateFee: 0,
      },
      {
        id: 3,
        date: "2024-01-15",
        amount: 13500,
        method: "Cash",
        reference: "CASH001",
        status: "Completed",
        lateFee: 0,
        note: "Initial down payment",
      },
    ],
    loanSchedule: [
      {
        installment: 1,
        dueDate: "2024-01-15",
        principalAmount: 1875,
        interestAmount: 625,
        totalAmount: 2500,
        status: "Paid",
        paidDate: "2024-01-15",
      },
      {
        installment: 2,
        dueDate: "2024-02-15",
        principalAmount: 1895,
        interestAmount: 605,
        totalAmount: 2500,
        status: "Paid",
        paidDate: "2024-02-14",
      },
      {
        installment: 3,
        dueDate: "2024-03-15",
        principalAmount: 1915,
        interestAmount: 585,
        totalAmount: 2500,
        status: "Due",
        paidDate: null,
      },
      {
        installment: 4,
        dueDate: "2024-04-15",
        principalAmount: 1935,
        interestAmount: 565,
        totalAmount: 2500,
        status: "Pending",
        paidDate: null,
      },
    ],
    recentActivities: [
      {
        id: 1,
        type: "payment",
        message: "Payment received: KES 2,500",
        timestamp: "2024-02-28 09:15",
        status: "success",
      },
      {
        id: 2,
        type: "reminder",
        message: "Payment reminder sent via SMS",
        timestamp: "2024-02-25 14:30",
        status: "info",
      },
      {
        id: 3,
        type: "restructure",
        message: "Loan terms updated - extended by 2 months",
        timestamp: "2024-02-20 11:45",
        status: "warning",
      },
      {
        id: 4,
        type: "assessment",
        message: "Credit assessment completed",
        timestamp: "2024-01-10 16:20",
        status: "success",
      },
    ],
  }
}

export default function LoanDetailPage({ loanId }) {
  const loan = getLoanData(loanId)
  const [isLoading, setIsLoading] = useState(false)

  const handleLoanAction = async (action) => {
    setIsLoading(true)
    console.log(`Performing ${action} on loan ${loanId}`)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const loanProgress = (loan.loanDetails.paidAmount / loan.loanDetails.totalAmount) * 100
  const principalProgress = (loan.loanDetails.paidAmount / loan.loanDetails.principalAmount) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/loans">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Loans
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Loan {loan.loanNumber}</h1>
            <p className="text-muted-foreground">{loan.customer.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant={
              loan.loanDetails.status === "Current"
                ? "default"
                : loan.loanDetails.status === "Overdue"
                  ? "destructive"
                  : "secondary"
            }
          >
            {loan.loanDetails.status}
            {loan.loanDetails.daysOverdue > 0 && ` (${loan.loanDetails.daysOverdue}d overdue)`}
          </Badge>
          <EditLoanModal loan={loan} />
        </div>
      </div>

      {/* Loan Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loan Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loanProgress.toFixed(1)}%</div>
            <Progress value={loanProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              KES {loan.loanDetails.remainingAmount.toLocaleString()} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {loan.loanDetails.paidAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">of KES {loan.loanDetails.totalAmount.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {loan.loanDetails.monthlyPayment.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Due: {loan.loanDetails.nextPaymentDate}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loan.customer.creditScore}</div>
            <p className="text-xs text-muted-foreground">
              {loan.customer.creditScore >= 80 ? "Excellent" : loan.customer.creditScore >= 60 ? "Good" : "Poor"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Principal Amount:</span>
                      <span className="text-sm font-medium">
                        KES {loan.loanDetails.principalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Interest Rate:</span>
                      <span className="text-sm font-medium">{loan.loanDetails.interestRate}% p.a.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Term:</span>
                      <span className="text-sm font-medium">{loan.loanDetails.termMonths} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Payment:</span>
                      <span className="text-sm font-medium">
                        KES {loan.loanDetails.monthlyPayment.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Start Date:</span>
                      <span className="text-sm font-medium">{loan.loanDetails.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">End Date:</span>
                      <span className="text-sm font-medium">{loan.loanDetails.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Collateral:</span>
                      <span className="text-sm font-medium">{loan.loanDetails.collateral}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">{loan.customer.name}</h3>
                        <p className="text-sm text-muted-foreground">{loan.customer.id}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{loan.customer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{loan.customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{loan.customer.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">ID: {loan.customer.idNumber}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Device Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Device:</span>
                          <span className="text-sm font-medium">{loan.device.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Model:</span>
                          <span className="text-sm font-medium">{loan.device.model}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Serial:</span>
                          <span className="text-sm font-medium">{loan.device.serialNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Status:</span>
                          <Badge variant={loan.device.status === "Active" ? "default" : "destructive"}>
                            {loan.device.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Late Fee</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loan.paymentHistory.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>KES {payment.amount.toLocaleString()}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell>{payment.reference}</TableCell>
                          <TableCell>
                            <Badge variant={payment.status === "Completed" ? "default" : "destructive"}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{payment.lateFee > 0 ? `KES ${payment.lateFee.toLocaleString()}` : "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Installment</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Principal</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loan.loanSchedule.map((installment) => (
                        <TableRow key={installment.installment}>
                          <TableCell>{installment.installment}</TableCell>
                          <TableCell>{installment.dueDate}</TableCell>
                          <TableCell>KES {installment.principalAmount.toLocaleString()}</TableCell>
                          <TableCell>KES {installment.interestAmount.toLocaleString()}</TableCell>
                          <TableCell>KES {installment.totalAmount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                installment.status === "Paid"
                                  ? "default"
                                  : installment.status === "Due"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {installment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loan.recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="mt-1">
                          {activity.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {activity.status === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                          {activity.status === "info" && <Clock className="h-4 w-4 text-blue-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Actions Sidebar */}
        <LoanQuickActions loan={loan} onAction={handleLoanAction} isLoading={isLoading} />
      </div>
    </div>
  )
}
