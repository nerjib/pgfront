import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Smartphone, DollarSign, TrendingUp, Battery, AlertTriangle, Zap, CreditCard } from "lucide-react"

const recentTransactions = [
  { id: "TXN001", customer: "James Ochieng", amount: 2500, type: "Payment", status: "Completed", time: "2 hours ago" },
  { id: "TXN002", customer: "Sarah Wanjiru", amount: 3750, type: "Payment", status: "Completed", time: "4 hours ago" },
  { id: "TXN003", customer: "Mary Nyong'o", amount: 2917, type: "Payment", status: "Completed", time: "6 hours ago" },
  { id: "TXN004", customer: "David Kiprop", amount: 2500, type: "Payment", status: "Failed", time: "1 day ago" },
]

const alertsData = [
  { id: 1, type: "Device Offline", message: "DEV003 has been offline for 2 days", severity: "high" },
  { id: 2, type: "Payment Overdue", message: "Customer David Kiprop is 15 days overdue", severity: "high" },
  { id: 3, type: "Low Battery", message: "5 devices have battery levels below 20%", severity: "medium" },
  { id: 4, type: "Agent Inactive", message: "Agent Peter Mwangi hasn't logged in for 5 days", severity: "medium" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your PayGo system overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NGN 2.4M</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,156</div>
            <p className="text-xs text-muted-foreground">92.7% online</p>
          </CardContent>
        </Card>
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
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest payment activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{transaction.customer}</p>
                    <p className="text-xs text-muted-foreground">{transaction.time}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">NGN {transaction.amount.toLocaleString()}</p>
                    <Badge variant={transaction.status === "Completed" ? "default" : "destructive"} className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
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
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                  </div>
                  <Badge variant={alert.severity === "high" ? "destructive" : "secondary"} className="text-xs">
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Generated</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2 MWh</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Battery Health</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Across all devices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NGN 1.8M</div>
            <p className="text-xs text-muted-foreground">892 active loans</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
