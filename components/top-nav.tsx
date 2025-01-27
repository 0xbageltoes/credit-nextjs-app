"use client"

import * as React from "react"
import { Logo } from "@/components/ui/logo"
import { UserNav } from "@/components/dashboard/user-nav"
import { TeamSwitcher } from "@/components/dashboard/team-switcher"
import { cn } from "@/lib/utils"

interface TopNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TopNav({ className, ...props }: TopNavProps) {
  return (
    <div
      className={cn("flex h-16 items-center px-4 gap-4 bg-background z-50 relative", className)}
      {...props}
    >
      <Logo className="h-8 w-auto" />
      <div className="ml-auto flex items-center space-x-4">
        <TeamSwitcher />
        <UserNav />
      </div>
    </div>
  )
}
