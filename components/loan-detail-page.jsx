"use client"

"use client"

import { useState, useEffect } from "react"
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
import https from "@/services/https";

export default function LoanDetailPage({ loanId }) {
  const [loan, setLoan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLoanData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/loans/${loanId}`, {
        headers: {
          "x-auth-token": token,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch loan data");
      }
      const data = await response.json();
      setLoan(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching loan:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loanId) {
      fetchLoanData();
    }
  }, [loanId]);

  const handleLoanAction = async (action) => {
    setIsLoading(true)
    console.log(`Performing ${action} on loan ${loanId}`)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  if (isLoading || !loan) {
    return <div>Loading loan data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const loanProgress = parseFloat(loan.progress) || 0;

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
            <h1 className="text-3xl font-bold">Loan {loan.loan_id}</h1>
            <p className="text-muted-foreground">{loan.customer.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
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
            {/* {loan.loanDetails.daysOverdue > 0 && ` (${loan.loanDetails.daysOverdue}d overdue)`} */}
          </Badge>
          <EditLoanModal loan={loan} onUpdate={fetchLoanData} />
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
              NGN {loan.remainingAmount.toLocaleString()} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NGN {loan.paidAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">of NGN {loan.totalAmount.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NGN {loan.monthlyPayment.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Due: {new Date(loan.nextPaymentDate).toLocaleDateString()}</p>
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
                        NGN {loan.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Interest Rate:</span>
                      <span className="text-sm font-medium">{/* loan.loanDetails.interestRate */}N/A</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Term:</span>
                      <span className="text-sm font-medium">{loan.termMonths} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Payment:</span>
                      <span className="text-sm font-medium">
                        NGN {loan.monthlyPayment.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Start Date:</span>
                      <span className="text-sm font-medium">{new Date(loan.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">End Date:</span>
                      <span className="text-sm font-medium">{new Date(loan.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Guarantor:</span>
                      <span className="text-sm font-medium">
                        {loan.guarantorDetails ? loan.guarantorDetails.name : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Assigned Agent:</span>
                      <span className="text-sm font-medium">
                        {loan.agent ? loan.agent.username : "N/A"}
                      </span>
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
                      {loan.paymentHistory && loan.paymentHistory.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                          <TableCell>NGN {payment.amount.toLocaleString()}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell>{payment.reference}</TableCell>
                          <TableCell>
                            <Badge variant={payment.status === "Completed" ? "default" : "destructive"}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{payment.lateFee > 0 ? `NGN ${payment.lateFee.toLocaleString()}` : "-"}</TableCell>
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
                      {/* Loan schedule data is not directly available from the API in this format */}
                      <TableRow>
                        <TableCell colSpan="6" className="text-center text-muted-foreground">
                          Payment schedule not available.
                        </TableCell>
                      </TableRow>
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
                    {/* Activities data is not directly available from the API in this format */}
                    <div className="text-center text-muted-foreground">
                      No recent activities available.
                    </div>
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

