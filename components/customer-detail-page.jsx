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
  Phone,
  Mail,
  MapPin,
  CreditCard,
  DollarSign,
  Smartphone,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { EditCustomerModal } from "./modals/edit-customer-modal"
import { CustomerQuickActions } from "./customer-quick-actions"

// Mock data - replace with actual data fetching
const getCustomerData = (customerId) => {
  return {
    id: customerId,
    personalInfo: {
      name: "James Ochieng",
      email: "james.ochieng@email.com",
      phone: "+254 712 345 678",
      alternatePhone: "+254 701 234 567",
      idNumber: "12345678",
      dateOfBirth: "1985-06-15",
      gender: "Male",
      maritalStatus: "Married",
      occupation: "Small Business Owner",
      monthlyIncome: 25000,
      dependents: 3,
    },
    address: {
      location: "Kibera, Nairobi",
      county: "Nairobi",
      ward: "Kibra",
      nearestLandmark: "Kibera Primary School",
      gpsCoordinates: "-1.3133, 36.7833",
    },
    creditInfo: {
      creditScore: 85,
      creditHistory: "Excellent",
      joinDate: "2024-01-15",
      status: "Active",
      riskLevel: "Low",
      totalCreditLimit: 50000,
      availableCredit: 25000,
    },
    loans: [
      {
        id: "LN001",
        deviceId: "DEV001",
        deviceType: "Solar Home System",
        principalAmount: 25000,
        totalAmount: 30000,
        paidAmount: 18500,
        remainingAmount: 11500,
        monthlyPayment: 2500,
        startDate: "2024-01-15",
        endDate: "2024-12-15",
        status: "Current",
        nextPaymentDate: "2024-03-15",
        progress: 61.7,
      },
    ],
    devices: [
      {
        id: "DEV001",
        serialNumber: "SLR-2024-001",
        type: "Solar Home System",
        model: "SHS-50W",
        status: "Active",
        installDate: "2024-01-15",
        batteryLevel: 85,
        lastSync: "2 minutes ago",
      },
    ],
    paymentHistory: [
      {
        id: 1,
        date: "2024-02-28",
        amount: 2500,
        method: "Mobile Money",
        reference: "MP240228001",
        status: "Completed",
        loanId: "LN001",
      },
      {
        id: 2,
        date: "2024-01-28",
        amount: 2500,
        method: "Mobile Money",
        reference: "MP240128001",
        status: "Completed",
        loanId: "LN001",
      },
      {
        id: 3,
        date: "2024-01-15",
        amount: 13500,
        method: "Cash",
        reference: "CASH001",
        status: "Completed",
        loanId: "LN001",
      },
    ],
    recentActivities: [
      {
        id: 1,
        type: "payment",
        message: "Payment received: NGN 2,500",
        timestamp: "2024-02-28 09:15",
        status: "success",
      },
      {
        id: 2,
        type: "device",
        message: "Device synchronized successfully",
        timestamp: "2024-02-28 08:30",
        status: "success",
      },
      {
        id: 3,
        type: "communication",
        message: "Payment reminder sent via SMS",
        timestamp: "2024-02-25 14:30",
        status: "info",
      },
      {
        id: 4,
        type: "credit",
        message: "Credit score updated: 85 (+2)",
        timestamp: "2024-02-20 11:45",
        status: "success",
      },
    ],
  }
}

export default function CustomerDetailPage({ customerId }) {
  const customer = getCustomerData(customerId)
  const [isLoading, setIsLoading] = useState(false)

  const handleCustomerAction = async (action) => {
    setIsLoading(true)
    console.log(`Performing ${action} on customer ${customerId}`)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const getCreditScoreColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const totalBorrowed = customer.loans.reduce((sum, loan) => sum + loan.totalAmount, 0)
  const totalPaid = customer.loans.reduce((sum, loan) => sum + loan.paidAmount, 0)
  const totalOutstanding = customer.loans.reduce((sum, loan) => sum + loan.remainingAmount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/customers">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Customers
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{customer.personalInfo.name}</h1>
            <p className="text-muted-foreground">{customer.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={customer.creditInfo.status === "Active" ? "default" : "destructive"}>
            {customer.creditInfo.status}
          </Badge>
          <EditCustomerModal customer={customer} />
        </div>
      </div>

      {/* Customer Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getCreditScoreColor(customer.creditInfo.creditScore)}`}>
              {customer.creditInfo.creditScore}
            </div>
            <p className="text-xs text-muted-foreground">{customer.creditInfo.creditHistory}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NGN {totalBorrowed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{customer.loans.length} loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NGN {totalOutstanding.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{((totalPaid / totalBorrowed) * 100).toFixed(1)}% paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devices</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.devices.length}</div>
            <p className="text-xs text-muted-foreground">
              {customer.devices.filter((d) => d.status === "Active").length} active
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
              <TabsTrigger value="loans">Loans</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Full Name:</span>
                      <span className="text-sm font-medium">{customer.personalInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">ID Number:</span>
                      <span className="text-sm font-medium">{customer.personalInfo.idNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Date of Birth:</span>
                      <span className="text-sm font-medium">{customer.personalInfo.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Gender:</span>
                      <span className="text-sm font-medium">{customer.personalInfo.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Marital Status:</span>
                      <span className="text-sm font-medium">{customer.personalInfo.maritalStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Occupation:</span>
                      <span className="text-sm font-medium">{customer.personalInfo.occupation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Income:</span>
                      <span className="text-sm font-medium">
                        NGN {customer.personalInfo.monthlyIncome.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact & Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{customer.personalInfo.phone}</span>
                      </div>
                      {customer.personalInfo.alternatePhone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{customer.personalInfo.alternatePhone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{customer.personalInfo.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm">{customer.address.location}</div>
                          <div className="text-xs text-muted-foreground">{customer.address.county}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ward:</span>
                          <span>{customer.address.ward}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Landmark:</span>
                          <span>{customer.address.nearestLandmark}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="loans" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Loans</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Loan ID</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Next Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customer.loans.map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell>
                            <Link href={`/loans/${loan.id}`} className="text-blue-600 hover:underline">
                              {loan.id}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{loan.deviceType}</div>
                              <div className="text-sm text-muted-foreground">{loan.deviceId}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">NGN {loan.totalAmount.toLocaleString()}</div>
                              <div className="text-sm text-muted-foreground">
                                Remaining: NGN {loan.remainingAmount.toLocaleString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Progress value={loan.progress} className="w-[60px]" />
                              <div className="text-xs text-muted-foreground">{loan.progress.toFixed(1)}%</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={loan.status === "Current" ? "default" : "destructive"}>{loan.status}</Badge>
                          </TableCell>
                          <TableCell>{loan.nextPaymentDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devices" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Devices</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device</TableHead>
                        <TableHead>Serial Number</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Battery</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead>Install Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customer.devices.map((device) => (
                        <TableRow key={device.id}>
                          <TableCell>
                            <Link href={`/devices/${device.id}`} className="text-blue-600 hover:underline">
                              <div>
                                <div className="font-medium">{device.type}</div>
                                <div className="text-sm text-muted-foreground">{device.model}</div>
                              </div>
                            </Link>
                          </TableCell>
                          <TableCell>{device.serialNumber}</TableCell>
                          <TableCell>
                            <Badge variant={device.status === "Active" ? "default" : "destructive"}>
                              {device.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{device.batteryLevel}%</TableCell>
                          <TableCell>{device.lastSync}</TableCell>
                          <TableCell>{device.installDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
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
                        <TableHead>Loan</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customer.paymentHistory.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>NGN {payment.amount.toLocaleString()}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell>{payment.reference}</TableCell>
                          <TableCell>
                            <Link href={`/loans/${payment.loanId}`} className="text-blue-600 hover:underline">
                              {payment.loanId}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant={payment.status === "Completed" ? "default" : "destructive"}>
                              {payment.status}
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
                    {customer.recentActivities.map((activity) => (
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
        <CustomerQuickActions customer={customer} onAction={handleCustomerAction} isLoading={isLoading} />
      </div>
    </div>
  )
}
