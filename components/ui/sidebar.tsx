"use client"

import * as React from "react"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { useSidebar } from "@/hooks/use-sidebar"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarContextValue {
  state: "expanded" | "collapsed"
  open: boolean
  width: string
  toggleSidebar: () => void
  setOpen: (open: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue>({
  state: "expanded",
  open: true,
  width: "240px",
  toggleSidebar: () => {},
  setOpen: () => {},
})

interface SidebarProviderProps {
  children: React.ReactNode
  width?: string
}

function SidebarProvider({ children, width = "240px" }: SidebarProviderProps) {
  const [state, setState] = React.useState<"expanded" | "collapsed">("expanded")
  const [open, setOpen] = React.useState(true)

  const toggleSidebar = React.useCallback(() => {
    setState((prev) => (prev === "expanded" ? "collapsed" : "expanded"))
  }, [])

  return (
    <SidebarContext.Provider
      value={{
        state,
        open,
        width,
        toggleSidebar,
        setOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

function Sidebar({ className, ...props }: SidebarProps) {
  const { state, width } = React.useContext(SidebarContext)

  return (
    <aside
      className={cn(
        "flex-shrink-0 border-r bg-background transition-[width]",
        state === "collapsed" ? "w-16" : `w-[${width}]`,
        className
      )}
      {...props}
    />
  )
}

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

function SidebarContent({ className, ...props }: SidebarContentProps) {
  return <div className={cn("flex flex-1 flex-col", className)} {...props} />
}

interface SidebarItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string
  isActive?: boolean
  icon?: LucideIcon
}

function SidebarItem({
  children,
  href,
  isActive,
  icon: Icon,
  className,
  ...props
}: SidebarItemProps) {
  const { state } = React.useContext(SidebarContext)
  const isCollapsed = state === "collapsed"

  const content = (
    <Link
      href={href}
      className={cn(
        "flex h-10 w-full items-center justify-start gap-2 rounded-md px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive && "bg-accent",
        isCollapsed && "justify-center px-0",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {!isCollapsed && children}
    </Link>
  )

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={20}>
          {children}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}

interface SidebarTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {}

function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  const { toggleSidebar, state } = React.useContext(SidebarContext)
  const isCollapsed = state === "collapsed"

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-6 w-6",
        className
      )}
      onClick={toggleSidebar}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "h-4 w-4 transition-transform",
          isCollapsed ? "rotate-180" : "rotate-0"
        )}
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarItem,
  SidebarTrigger,
  SidebarProvider,
  SidebarContext,
}
