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
  Tag,
} from "lucide-react"
import log from "../public/logo.png"
import { useState, useEffect } from "react"

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
        url: "/dashboard",
        icon: Home,
        permission: "analytics:read:business",
      },
      // {
      //   title: "Analytics",
      //   url: "/analytics",
      //   icon: BarChart3,
      // },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Agents",
        url: "/agents",
        icon: UserCheck,
        permission: "agent:read",
      },
      // {
      //   title: "Super Agents",
      //   url: "/super-agents",
      //   icon: Users,
      //   permission: "super:agent:read",
      // },
      {
        title: "Devices",
        url: "/devices",
        icon: Smartphone,
        permission: "device:read",
      },
      {
        title: "Customers",
        url: "/customers",
        icon: Users,
        // NOTE: Using agent:read as a placeholder permission for customers
        permission: "agent:read",
      },
      {
        title: "Paygo",
        url: "/loans",
        icon: CreditCard,
        permission: "loan:read",
      },
      {
        title: "Deals",
        url: "/deals",
        icon: Tag,
        permission: "deals:read",
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
        permission: "payment:read",
      },
      {
        title: "Warehouse",
        url: "/inventory",
        icon: Package,
        // NOTE: Using device:read as a placeholder permission for inventory
        permission: "device:read",
      },
      // {
      //   title: "Energy Usage",
      //   url: "/energy",
      //   icon: Zap,
      // },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Reports",
        url: "/reports",
        icon: TrendingUp,
        permission: "analytics:read:business",
      },
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
        permission: "business:update",
      },
    ],
  },
]

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function AppSidebar({ ...props }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userPermissions, setUserPermissions] = useState([]);
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const parsedData = JSON.parse(authData);
      setUserPermissions(parsedData.permissions || []);
      setBusinessName(parsedData.business?.name || "");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    router.push("/login");
  };

  return (
    <Sidebar {...props} className="bg-gray-900 text-gray-500">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="h-6 w-6" >
            <img src="/logo.png" alt="logo" />
          </div>
          <div>
            <span className="font-bold text-lg">RayKonet</span>
            {businessName && <span className="text-sm text-muted-foreground block">{businessName}</span>}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigationItems.map((section) => {
          const filteredItems = section.items.filter(
            (item) => !item.permission || userPermissions.includes(item.permission)
          );

          if (filteredItems.length === 0) {
            return null;
          }

          return (
            <SidebarGroup key={section.title}>
              <SidebarGroupLabel className="text-indigo-600 ">{section.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                          asChild 
                          isActive={pathname === item.url}
                          className="hover:bg-gray-700 text-gray-500 data-[active=true]:bg-[#ffac04] data-[active=true]:text-white data-[active=true]:rounded-md"
                      >
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
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="hover:bg-gray-700 text-gray-100">
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