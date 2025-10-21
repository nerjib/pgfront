"use client"

import { useState } from "react"
import { AppSidebar } from "./components/app-sidebar"
import { DashboardOverview } from "./components/dashboard-overview"
import { AgentsPage } from "./components/agents-page"
import { DevicesPage } from "./components/devices-page"
import { LoansPage } from "./components/loans-page"
import { CustomersPage } from "./components/customers-page"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function PayGoDashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardOverview />
      case "agents":
        return <AgentsPage />
      case "devices":
        return <DevicesPage />
      case "loans":
        return <LoansPage />
      case "customers":
        return <CustomersPage />
      default:
        return <DashboardOverview />
    }
  }

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard":
        return "Dashboard"
      case "agents":
        return "Agents"
      case "devices":
        return "Devices"
      case "loans":
        return "Loans"
      case "customers":
        return "Customers"
      default:
        return "Dashboard"
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#" onClick={() => setCurrentPage("dashboard")}>
                  RayKonet
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Navigation Handler */}
          <div className="hidden">
            {/* This handles navigation clicks from sidebar */}
            <div onClick={() => setCurrentPage("dashboard")} id="dashboard" />
            <div onClick={() => setCurrentPage("agents")} id="agents" />
            <div onClick={() => setCurrentPage("devices")} id="devices" />
            <div onClick={() => setCurrentPage("loans")} id="loans" />
            <div onClick={() => setCurrentPage("customers")} id="customers" />
          </div>

          {renderCurrentPage()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
