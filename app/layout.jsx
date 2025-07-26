"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "../components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const showSidebar = (pathname !== "/" && pathname !== "/login");

  return (
    <html lang="en">
      <body className={inter.className}>
        {showSidebar ? (
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <div className="flex items-center gap-2">
                  <span className="font-semibold">PayGo Pro</span>
                </div>
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
