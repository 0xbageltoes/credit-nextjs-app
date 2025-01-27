'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useUser } from '@/components/providers/supabase-provider'
import { createClient } from '@/utils/supabase-browser'
import { UserSettings } from '@/types/database'
import { toast } from "@/components/ui/use-toast"
import { SettingsTabs } from "@/components/settings/settings-tabs"

const settingsFormSchema = z.object({
  decimal_places: z.number().min(0).max(10),
  default_currency: z.string(),
  default_return_metric: z.enum(['yield_percent', 'price', 'spread']),
  show_grid_lines: z.boolean(),
  dark_mode: z.boolean(),
  compact_mode: z.boolean(),
  day_count_convention: z.string(),
  settlement_days: z.number().min(0).max(7),
  price_decimal_places: z.number().min(0).max(10),
  yield_decimal_places: z.number().min(0).max(10),
  spread_decimal_places: z.number().min(0).max(10),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

const defaultValues: Partial<SettingsFormValues> = {
  decimal_places: 2,
  default_currency: 'USD',
  default_return_metric: 'yield_percent',
  show_grid_lines: true,
  dark_mode: false,
  compact_mode: false,
  day_count_convention: 'ACT/360',
  settlement_days: 2,
  price_decimal_places: 4,
  yield_decimal_places: 3,
  spread_decimal_places: 2,
}

function GlobalSettingsForm() {
  const { user } = useUser()
  const supabase = createClient()

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues
  })

  async function onSubmit(data: SettingsFormValues) {
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({ 
          user_id: user?.id,
          ...data,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast({
        title: "Settings Updated",
        description: "Your application settings have been saved successfully.",
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "There was a problem saving your settings.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="p-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium">Display Settings</h3>
              <p className="text-sm text-muted-foreground">
                Customize how information is displayed in the application.
              </p>
            </div>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="decimal_places"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Decimal Places</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of decimal places to show by default.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="default_currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                        <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Default currency for displaying monetary values.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="default_return_metric"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Return Metric</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a return metric" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yield_percent">Yield %</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="spread">Spread</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Default metric for displaying returns.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="show_grid_lines"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show Grid Lines</FormLabel>
                      <FormDescription>
                        Show grid lines in tables and charts.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dark_mode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Dark Mode</FormLabel>
                      <FormDescription>
                        Use dark mode for the application interface.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="compact_mode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Compact Mode</FormLabel>
                      <FormDescription>
                        Use compact spacing in tables and forms.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium">Calculation Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure settings for financial calculations.
              </p>
            </div>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="day_count_convention"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day Count Convention</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a convention" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACT/360">ACT/360</SelectItem>
                        <SelectItem value="ACT/365">ACT/365</SelectItem>
                        <SelectItem value="30/360">30/360</SelectItem>
                        <SelectItem value="30E/360">30E/360</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Default day count convention for calculations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="settlement_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Settlement Days</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Default number of settlement days.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium">Precision Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure decimal precision for different types of values.
              </p>
            </div>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="price_decimal_places"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Decimal Places</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of decimal places for price values.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yield_decimal_places"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yield Decimal Places</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of decimal places for yield values.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="spread_decimal_places"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spread Decimal Places</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of decimal places for spread values.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  )
}

function UnderDevelopment() {
  return (
    <Card className="p-6">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">Under Development</h3>
        <p className="text-sm text-muted-foreground">Check back later.</p>
      </div>
    </Card>
  )
}

export default function SettingsPage() {
  const tabs = [
    {
      id: "global",
      title: "Global",
      content: <GlobalSettingsForm />,
    },
    {
      id: "forecasting",
      title: "Forecasting",
      content: <UnderDevelopment />,
    },
    {
      id: "instrument",
      title: "Instrument",
      content: <UnderDevelopment />,
    },
    {
      id: "rates",
      title: "Rates",
      content: <UnderDevelopment />,
    },
    {
      id: "curves",
      title: "Curves",
      content: <UnderDevelopment />,
    },
    {
      id: "scenario",
      title: "Scenario",
      content: <UnderDevelopment />,
    },
    {
      id: "portfolios",
      title: "Portfolios",
      content: <UnderDevelopment />,
    },
    {
      id: "reports",
      title: "Reports",
      content: <UnderDevelopment />,
    },
    {
      id: "apps",
      title: "Apps",
      content: <UnderDevelopment />,
    },
    {
      id: "data-access",
      title: "Data Access",
      content: <UnderDevelopment />,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your application settings and preferences.
        </p>
      </div>
      <SettingsTabs defaultTab="global" tabs={tabs} />
    </div>
  )
}
