'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SettingsTabsProps {
  defaultTab?: string
  tabs: {
    id: string
    title: string
    content: React.ReactNode
  }[]
}

export function SettingsTabs({ defaultTab, tabs }: SettingsTabsProps) {
  return (
    <Tabs defaultValue={defaultTab || tabs[0].id} className="space-y-4">
      <TabsList className={cn(
        "w-full h-auto p-0 bg-transparent rounded-none",
        "flex items-start justify-start"
      )}>
        <div className="flex h-9 rounded-lg bg-muted p-1 text-muted-foreground">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
              )}
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </div>
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="space-y-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
