"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNav } from "@/components/top-nav"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="relative min-h-screen">
          <TopNav className="fixed top-0 left-0 right-0 border-b" />
          <div className="flex pt-16">
            <AppSidebar />
            <main className="flex-1 px-4 py-4">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
