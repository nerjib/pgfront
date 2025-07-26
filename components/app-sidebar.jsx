"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users,
  Smartphone,
  CreditCard,
  BarChart3,
  Settings,
  Home,
  Package,
  DollarSign,
  UserCheck,
  Zap,
  TrendingUp,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: Home,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Agents",
        url: "/agents",
        icon: UserCheck,
      },
      {
        title: "Devices",
        url: "/devices",
        icon: Smartphone,
      },
      {
        title: "Customers",
        url: "/customers",
        icon: Users,
      },
      {
        title: "Loans",
        url: "/loans",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Payments",
        url: "/payments",
        icon: DollarSign,
      },
      {
        title: "Inventory",
        url: "/inventory",
        icon: Package,
      },
      {
        title: "Energy Usage",
        url: "/energy",
        icon: Zap,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Reports",
        url: "/reports",
        icon: TrendingUp,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
]

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

// ... (imports)

export function AppSidebar({ ...props }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Zap className="h-6 w-6 text-green-600" />
          <span className="font-bold text-lg">PayGo Pro</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
