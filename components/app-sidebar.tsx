"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Sidebar, SidebarContent, SidebarItem, SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  User, 
  CreditCard, 
  Settings,
  ChevronRight
} from "lucide-react"

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AppSidebar({ className, ...props }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar className={cn("border-r z-40 sticky top-16 h-[calc(100vh-4rem)] flex flex-col justify-between", className)} {...props}>
      <SidebarContent>
        <nav className="grid gap-1 px-2">
          <SidebarItem 
            href="/dashboard" 
            isActive={pathname === "/dashboard"}
            icon={LayoutDashboard}
          >
            Dashboard
          </SidebarItem>
          <SidebarItem
            href="/dashboard/profile"
            isActive={pathname === "/dashboard/profile"}
            icon={User}
          >
            Profile
          </SidebarItem>
          <SidebarItem
            href="/dashboard/account"
            isActive={pathname === "/dashboard/account"}
            icon={CreditCard}
          >
            Account
          </SidebarItem>
          <SidebarItem
            href="/dashboard/settings"
            isActive={pathname === "/dashboard/settings"}
            icon={Settings}
          >
            Settings
          </SidebarItem>
        </nav>
      </SidebarContent>
      <SidebarTrigger className="mx-auto mb-4" />
    </Sidebar>
  )
}
