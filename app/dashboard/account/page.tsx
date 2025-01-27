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
import { Input } from "@/components/ui/input"
import { useUser } from '@/components/providers/supabase-provider'
import { createClient } from '@/utils/supabase-browser'
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"

const accountFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email(),
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  firm_name: z.string().min(2, {
    message: "Firm name must be at least 2 characters.",
  }),
  contact_name: z.string().min(2, {
    message: "Contact name must be at least 2 characters.",
  }),
  contact_email: z.string().email(),
  contact_phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

interface UserDetails {
  username: string
  first_name: string
  last_name: string
  firm_name: string
  contact_name: string
  contact_email: string
  contact_phone: string
}

export default function AccountPage() {
  const { user } = useUser()
  const supabase = createClient()
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      username: '',
      email: user?.email || '',
      first_name: '',
      last_name: '',
      firm_name: '',
      contact_name: '',
      contact_email: '',
      contact_phone: '',
    },
  })

  useEffect(() => {
    async function loadUserDetails() {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('user_details')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        if (data) {
          setUserDetails(data)
          form.reset({
            username: data.username || '',
            email: user.email || '',
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            firm_name: data.firm_name || '',
            contact_name: data.contact_name || '',
            contact_email: data.contact_email || '',
            contact_phone: data.contact_phone || '',
          })
        }
      } catch (error) {
        console.error('Error loading user details:', error)
        toast({
          title: "Error",
          description: "Could not load user details.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserDetails()
  }, [user, form, supabase])

  async function onSubmit(data: AccountFormValues) {
    try {
      // Update email if changed
      if (data.email !== user?.email) {
        const { error } = await supabase.auth.updateUser({
          email: data.email,
        })

        if (error) throw error

        toast({
          title: "Email Update Requested",
          description: "Please check your new email address for a confirmation link.",
        })
      }

      // Update or insert user details
      const { error: detailsError } = await supabase
        .from('user_details')
        .upsert({
          id: user?.id,
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
          firm_name: data.firm_name,
          contact_name: data.contact_name,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone,
        })

      if (detailsError) throw detailsError

      toast({
        title: "Settings Updated",
        description: "Your account settings have been updated successfully.",
      })
    } catch (error) {
      console.error('Error updating user:', error)
      toast({
        title: "Error",
        description: "There was a problem updating your settings.",
        variant: "destructive",
      })
    }
  }

  if (!user) return null

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="oauth-apps">OAuth Apps</TabsTrigger>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Account Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Your username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormDescription>
                            {user?.email_confirmed_at 
                              ? "Your email is confirmed." 
                              : "Please confirm your email address."}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Company Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firm_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Firm Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contact_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contact_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contact_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="reset">Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Subscription Plan</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Current Plan:</span>
                  <span className="font-medium">PRO</span>
                </div>
                <div className="flex justify-between">
                  <span>Billing Cycle:</span>
                  <span>Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Payment:</span>
                  <span>February 1, 2025</span>
                </div>
              </div>
              <Button variant="outline">Change Plan</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Payment Methods</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-sm">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-500">Expires 05/2025</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
              </div>
              <Button variant="outline">Add Payment Method</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Billing History</h3>
              <div className="space-y-4">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Amount</th>
                        <th scope="col" className="px-6 py-3">Invoice Number</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4">Jan 15, 2025</td>
                        <td className="px-6 py-4">$54.33</td>
                        <td className="px-6 py-4">INV-2025-0007</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Paid
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm">Download</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
