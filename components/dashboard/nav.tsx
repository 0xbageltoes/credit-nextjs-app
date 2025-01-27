"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Settings,
  CreditCard,
  Users,
  PlusCircle,
  Calendar,
} from "lucide-react"

export type NavItem = {
  title: string
  label?: string
  icon?: any
  variant?: "default" | "ghost"
  href?: string
}

export type NavItems = {
  title: string
  items: NavItem[]
}[]

export const navItems: NavItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Customers",
        href: "/dashboard/customers",
        icon: Users,
      },
      {
        title: "Credit Cards",
        href: "/dashboard/cards",
        icon: CreditCard,
      },
      {
        title: "Calendar",
        href: "/dashboard/calendar",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
]

interface NavProps {
  items: NavItems
}

export function Nav({ items }: NavProps) {
  const path = usePathname()

  if (!items?.length) {
    return null
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        return (
          <div key={index} className="flex flex-col space-y-2">
            <h4 className="font-medium">{item.title}</h4>
            {item?.items?.length && (
              <div className="grid gap-1">
                {item.items.map((item, index) =>
                  item.href ? (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        path === item.href ? "bg-accent" : "transparent"
                      )}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </Link>
                  ) : (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium opacity-60"
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
