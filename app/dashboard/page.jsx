"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Smartphone, DollarSign, TrendingUp, Battery, AlertTriangle, Zap, CreditCard } from "lucide-react"
import { useEffect, useState } from "react"
import https from "@/services/https"

const alertsData = [
  { id: 1, type: "Device Offline", message: "DEV003 has been offline for 2 days", severity: "high" },
  { id: 2, type: "Payment Overdue", message: "Customer David Kiprop is 15 days overdue", severity: "high" },
  { id: 3, type: "Low Battery", message: "5 devices have battery levels below 20%", severity: "medium" },
  { id: 4, type: "Agent Inactive", message: "Agent Peter Mwangi hasn't logged in for 5 days", severity: "medium" },
]

export default function DashboardPage() {
  const [overview, setOverview] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [revenueOverview, setRevenueOverview] = useState(null);
  const [prevRevenueOverview, setPrevRevenueOverview] = useState(null);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        const overviewResponse = await fetch(`${https.baseUrl}/analytics/overview`, {
          headers: { "x-auth-token": token },
        })

        if (overviewResponse.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        const overviewData = await overviewResponse.json()
        setOverview(overviewData)

        const paymentsResponse = await fetch(`${https.baseUrl}/payments`, {
          headers: { "x-auth-token": token },
        })
        const paymentsData = await paymentsResponse.json()
        setTransactions(paymentsData.slice(0, 4))

        const revenueResponse = await fetch(`${https.baseUrl}/analytics/revenue-overview`, {
          headers: { "x-auth-token": token },
        });
        const revenueData = await revenueResponse.json();
        setRevenueOverview(revenueData);

        const prevRevenueResponse = await fetch(`${https.baseUrl}/analytics/revenue-overview/previous-month`, {
          headers: { "x-auth-token": token },
        });
        const prevRevenueData = await prevRevenueResponse.json();
        setPrevRevenueOverview(prevRevenueData);

      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to your PayGo system overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NGN {overview?.totalPayments.toLocaleString()}</div>
            {/* <p className="text-xs text-gray-600">+12% from last month</p> */}
          </CardContent>
        </Card>
        <Card className="shadow-md rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Active Devices</CardTitle>
            <Smartphone className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.assignedDevices}</div>
            {/* <p className="text-xs text-gray-600">92.7% online</p> */}
          </CardContent>
        </Card>
        <Card className="shadow-md rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totalCustomers}</div>
            {/* <p className="text-xs text-gray-600">+23 this month</p> */}
          </CardContent>
        </Card>
        {/* <Card className="shadow-md rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
          </CardContent>
        </Card> */}
      </div>

      {/* Revenue Analytics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Amount Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NGN {parseFloat(revenueOverview?.amountCollected).toLocaleString()}</div>
            <p className="text-xs text-gray-600">
              {prevRevenueOverview?.amountCollected > 0
                ? `${(((revenueOverview?.amountCollected - prevRevenueOverview?.amountCollected) / prevRevenueOverview?.amountCollected) * 100).toFixed(2)}% from last month`
                : 'vs NGN 0 last month'}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Expected Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NGN {parseFloat(revenueOverview?.expectedRevenue).toLocaleString()}</div>
            <p className="text-xs text-gray-600">
              {prevRevenueOverview?.expectedRevenue > 0
                ? `${(((revenueOverview?.expectedRevenue - prevRevenueOverview?.expectedRevenue) / prevRevenueOverview?.expectedRevenue) * 100).toFixed(2)}% from last month`
                : 'vs NGN 0 last month'}
            </p>
          </CardContent>
        </Card>
        {/* <Card className="shadow-md rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Pending Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NGN {parseFloat(revenueOverview?.pendingAmount).toLocaleString()}</div>
            <p className="text-xs text-gray-600">
              {prevRevenueOverview?.pendingAmount > 0
                ? `${(((revenueOverview?.pendingAmount - prevRevenueOverview?.pendingAmount) / prevRevenueOverview?.pendingAmount) * 100).toFixed(2)}% from last month`
                : 'vs NGN 0 last month'}
            </p>
          </CardContent>
        </Card> */}
        <Card className="shadow-md rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenueOverview?.expectedRevenue > 0 
                ? `${((revenueOverview?.amountCollected / revenueOverview?.expectedRevenue) * 100).toFixed(2)}%`
                : '0%'}
            </div>
            <p className="text-xs text-gray-600">
                {prevRevenueOverview?.expectedRevenue > 0
                    ? `vs ${((prevRevenueOverview?.amountCollected / prevRevenueOverview?.expectedRevenue) * 100).toFixed(2)}% last month`
                    : 'vs 0% last month'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Transactions */}
        <Card className="shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest payment activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{transaction.customer}</p>
                    <p className="text-xs text-gray-600">{new Date(transaction.payment_date).toLocaleTimeString()}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">NGN {transaction.amount.toLocaleString()}</p>
                    <Badge variant={transaction.status === "completed" ? "default" : "destructive"} className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        {/* <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Important notifications requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertsData.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3">
                  <AlertTriangle
                    className={`h-4 w-4 mt-0.5 ${alert.severity === "high" ? "text-red-500" : "text-yellow-500"}`}
                  />
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium">{alert.type}</p>
                    <p className="text-xs text-gray-600">{alert.message}</p>
                  </div>
                  <Badge variant={alert.severity === "high" ? "destructive" : "secondary"} className="text-xs">
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3 hidden" hidden>
        <Card className="shadow-md rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Energy Generated</CardTitle>
            <Zap className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2 MWh</div>
            <p className="text-xs text-gray-600">This month</p>
          </CardContent>
        </Card>
        <Card className="shadow-md rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Avg Battery Health</CardTitle>
            <Battery className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-gray-600">Across all devices</p>
          </CardContent>
        </Card>
        <Card className="shadow-md rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Outstanding Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NGN 1.8M</div>
            <p className="text-xs text-gray-600">892 active loans</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
