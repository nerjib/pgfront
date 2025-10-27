"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "../components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const showSidebar = (pathname !== "/" && pathname !== "/login" && pathname !== "/forgot-password");
  const [userFullName, setUserFullName] = useState("");

  useEffect(() => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const parsedData = JSON.parse(authData);
      setUserFullName(parsedData.user?.name || "");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <html lang="en">
      <head>
        <title>RaKonet</title>
        <link rel="icon" href="/logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta property="og:image" content="/logo.png" />
      </head>
      <body className={inter.className}>
        {showSidebar ? (
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <div className="flex items-center gap-2">
                  <span className="font-semibold">RayKonet</span>
                </div>
                <div className="flex-grow" />
                {userFullName && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="font-medium text-sm flex items-center gap-1">
                        <UserCircle className="h-4 w-4" />
                        {userFullName}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleLogout}>
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </header>
              <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        ) : (
          <main>{children}</main>
        )}
      </body>
    </html>
  );
}
