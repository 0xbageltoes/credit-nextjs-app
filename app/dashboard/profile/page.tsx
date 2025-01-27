'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from '@/components/providers/supabase-provider'
import { Profile } from '@/types/database'
import { createClient } from '@/utils/supabase-browser'
import { ImageUpload } from '@/components/profile/image-upload'
import { ProfileForm } from '@/components/profile/profile-form'
import { Icons } from "@/components/ui/icons"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { useState, useEffect } from 'react'

export default function ProfilePage() {
  const { user } = useUser()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        setProfile(data)
      } catch (error: any) {
        console.error('Error loading profile:', error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [user, supabase])

  const handleProfileUpdate = async (data: Partial<Profile>) => {
    try {
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...data })

      if (error) throw error

      setProfile(prev => prev ? { ...prev, ...data } : null)
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!user || isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden">
        <div className="h-32 bg-muted">
          {profile?.banner_url && (
            <img
              src={profile.banner_url}
              alt="Profile banner"
              className="h-full w-full object-cover"
            />
          )}
          <ImageUpload
            endpoint="banner"
            onUploadComplete={(url) =>
              handleProfileUpdate({ banner_url: url })
            }
          >
            <Button
              variant="ghost"
              className="absolute right-4 top-4 h-8 w-8 rounded-full bg-background/80 p-0 backdrop-blur-sm"
              type="button"
            >
              <Icons.camera className="h-4 w-4" />
              <span className="sr-only">Upload banner</span>
            </Button>
          </ImageUpload>
        </div>
        <div className="relative px-6 pb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="-mt-8 h-16 w-16 border-4 border-background">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <ImageUpload
                endpoint="avatar"
                onUploadComplete={(url) =>
                  handleProfileUpdate({ avatar_url: url })
                }
              >
                <Button
                  variant="ghost"
                  className="absolute -right-1 -bottom-1 h-6 w-6 rounded-full bg-background p-0 shadow-sm"
                  type="button"
                >
                  <Icons.camera className="h-3 w-3" />
                  <span className="sr-only">Upload avatar</span>
                </Button>
              </ImageUpload>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profile?.full_name || user.email}</h2>
              <p className="text-muted-foreground">
                {profile?.bio || "No bio set"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {user.email_confirmed_at && (
                <Badge variant="secondary">
                  <Icons.check className="mr-1 h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <ProfileForm
          profile={profile}
          onSave={handleProfileUpdate}
        />
      </Card>
    </div>
  )
}
