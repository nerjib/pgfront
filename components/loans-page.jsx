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
import { AddLoanModal } from "./modals/add-loan-modal"
import { useState, useEffect } from "react";
import https from "@/services/https";

export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/loans`, {
        headers: {
          "x-auth-token": token,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch loans");
      }
      const data = await response.json();
      setLoans(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  if (loading) {
    return <div>Loading loans...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Loans</h1>
          <p className="text-muted-foreground">Manage customer loans and payment schedules</p>
        </div>
        <AddLoanModal onLoanAdded={fetchLoans} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loans.length}</div>
            <p className="text-xs text-muted-foreground">{/* +12 this month */}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loans.filter(loan => loan.status === 'Current').length}</div>
            <p className="text-xs text-muted-foreground">{/* 71.5% of total */}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Loans</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loans.filter(loan => loan.status === 'Overdue').length}</div>
            <p className="text-xs text-muted-foreground">{/* 3.6% of active */}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{/* 94.2% */}</div>
            <p className="text-xs text-muted-foreground">{/* +1.2% from last month */}</p>
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
              {loans.map((loan) => {
                const progressPercentage = loan.payment_progress || 0;
                return (
                  <TableRow key={loan.loan_id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{loan.loan_id}</div>
                        <div className="text-sm text-muted-foreground">{/* loan.deviceId */}</div>
                      </div>
                    </TableCell>
                    <TableCell>{loan.customer_name}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">NGN {loan.loan_amount?.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {/* Remaining: NGN {loan.remainingAmount.toLocaleString()} */}
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
                        {/* {loan.daysOverdue > 0 && ` (${loan.daysOverdue}d)`} */}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(loan.next_payment).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>NGN {loan.monthly_payment?.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/loans/${loan.loan_id}`}>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </Link>
                        <QuickRecordPayment
                          loan={{
                            id: loan.loan_id,
                            loanNumber: loan.loan_id,
                            customer: { name: loan.customer_name },
                            loanDetails: {
                              remainingAmount: loan.loan_amount - (loan.loan_amount * (loan.payment_progress / 100)),
                              monthlyPayment: loan.monthly_payment,
                              nextPaymentDate: loan.next_payment,
                              status: loan.status,
                            },
                          }}
                          onPaymentRecorded={(paymentData) => {
                            console.log("Payment recorded for loan:", loan.loan_id, paymentData)
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
