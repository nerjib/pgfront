"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Users, CreditCard, MapPin, Phone, Mail, TrendingUp, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { AddCustomerModal } from "./modals/add-customer-modal"
import Link from "next/link"

const customersData = [
  {
    id: "CUST001",
    name: "James Ochieng",
    email: "james.ochieng@email.com",
    phone: "+254 712 345 678",
    location: "Kibera, Nairobi",
    county: "Nairobi",
    idNumber: "12345678",
    joinDate: "2024-01-15",
    status: "Active",
    creditScore: 85,
    totalLoans: 1,
    activeLoans: 1,
    totalBorrowed: 25000,
    totalPaid: 18500,
    outstandingBalance: 6500,
    paymentHistory: "Excellent",
    devices: 1,
    lastPayment: "2024-02-28",
    nextPaymentDue: "2024-03-15",
  },
  {
    id: "CUST002",
    name: "Sarah Wanjiru",
    email: "sarah.wanjiru@email.com",
    phone: "+254 723 456 789",
    location: "Kisumu Central",
    county: "Kisumu",
    idNumber: "23456789",
    joinDate: "2024-01-20",
    status: "Active",
    creditScore: 78,
    totalLoans: 1,
    activeLoans: 1,
    totalBorrowed: 45000,
    totalPaid: 22500,
    outstandingBalance: 22500,
    paymentHistory: "Good",
    devices: 1,
    lastPayment: "2024-02-25",
    nextPaymentDue: "2024-03-20",
  },
  {
    id: "CUST003",
    name: "David Kiprop",
    email: "david.kiprop@email.com",
    phone: "+254 734 567 890",
    location: "Eldoret Town",
    county: "Uasin Gishu",
    idNumber: "34567890",
    joinDate: "2024-01-10",
    status: "Overdue",
    creditScore: 65,
    totalLoans: 2,
    activeLoans: 1,
    totalBorrowed: 55000,
    totalPaid: 40000,
    outstandingBalance: 15000,
    paymentHistory: "Fair",
    devices: 2,
    lastPayment: "2024-01-28",
    nextPaymentDue: "2024-02-10",
  },
  {
    id: "CUST004",
    name: "Mary Nyong'o",
    email: "mary.nyongo@email.com",
    phone: "+254 745 678 901",
    location: "Mombasa Island",
    county: "Mombasa",
    idNumber: "45678901",
    joinDate: "2023-08-01",
    status: "Active",
    creditScore: 92,
    totalLoans: 3,
    activeLoans: 0,
    totalBorrowed: 85000,
    totalPaid: 85000,
    outstandingBalance: 0,
    paymentHistory: "Excellent",
    devices: 2,
    lastPayment: "2024-02-20",
    nextPaymentDue: "N/A",
  },
  {
    id: "CUST005",
    name: "Peter Mwangi",
    email: "peter.mwangi@email.com",
    phone: "+254 756 789 012",
    location: "Thika Town",
    county: "Kiambu",
    idNumber: "56789012",
    joinDate: "2024-02-01",
    status: "New",
    creditScore: 70,
    totalLoans: 1,
    activeLoans: 1,
    totalBorrowed: 30000,
    totalPaid: 5000,
    outstandingBalance: 25000,
    paymentHistory: "New Customer",
    devices: 1,
    lastPayment: "2024-02-15",
    nextPaymentDue: "2024-03-01",
  },
]

export default function CustomersPage() {
  const getCreditScoreColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getCreditScoreLabel = (score) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Poor"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage customer profiles and loan portfolios</p>
        </div>
        <AddCustomerModal />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+23 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,156</div>
            <p className="text-xs text-muted-foreground">92.7% active rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Customers</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">3.6% of active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Credit Score</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78</div>
            <p className="text-xs text-muted-foreground">+2 points this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
          <CardDescription>View and manage all customer profiles and loan information</CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search customers..." className="pl-8" />
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
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Credit Score</TableHead>
                <TableHead>Loans</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customersData.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">{customer.id}</div>
                      <div className="text-xs text-muted-foreground">Joined: {customer.joinDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Phone className="mr-1 h-3 w-3" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="mr-1 h-3 w-3" />
                        {customer.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      <div>
                        <div className="text-sm">{customer.location}</div>
                        <div className="text-xs text-muted-foreground">{customer.county}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className={`text-lg font-bold ${getCreditScoreColor(customer.creditScore)}`}>
                        {customer.creditScore}
                      </div>
                      <div className="text-xs text-muted-foreground">{getCreditScoreLabel(customer.creditScore)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {customer.activeLoans} active / {customer.totalLoans} total
                      </div>
                      <div className="text-xs text-muted-foreground">{customer.devices} devices</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">NGN {customer.outstandingBalance.toLocaleString()}</div>
                      {customer.outstandingBalance > 0 && (
                        <div className="text-xs text-muted-foreground">Next: {customer.nextPaymentDue}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        customer.status === "Active"
                          ? "default"
                          : customer.status === "Overdue"
                            ? "destructive"
                            : customer.status === "New"
                              ? "secondary"
                              : "outline"
                      }
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/customers/${customer.id}`}>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
