'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase-browser'
import { useUser } from '@/components/providers/supabase-provider'
import { toast } from "@/components/ui/use-toast"

interface ImageUploadProps {
  endpoint: 'avatar' | 'banner'
  onUploadComplete: (url: string) => void
  children: React.ReactNode
}

export function ImageUpload({ endpoint, onUploadComplete, children }: ImageUploadProps) {
  const { user } = useUser()
  const [isUploading, setIsUploading] = useState(false)
  const supabase = createClient()

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to upload images')
      }

      setIsUploading(true)
      const file = event.target.files?.[0]
      if (!file) {
        throw new Error('No file selected')
      }

      // Validate file type
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const validTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp']
      if (!fileExt || !validTypes.includes(fileExt)) {
        throw new Error('Invalid file type. Please upload an image file (jpg, jpeg, png, gif, or webp).')
      }

      // Validate file size (5MB for avatars, 10MB for banners)
      const maxSize = endpoint === 'avatar' ? 5 * 1024 * 1024 : 10 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error(`File size too large. Maximum size is ${maxSize / 1024 / 1024}MB`)
      }

      // Create a unique file path
      const bucketName = endpoint === 'avatar' ? 'avatars' : 'banners'
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        throw new Error(uploadError.message)
      }

      if (!data?.path) {
        throw new Error('Upload failed - no path returned')
      }

      // Get the public URL
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path)

      if (urlError) {
        console.error('Get public URL error:', urlError)
        throw new Error('Failed to get public URL for uploaded file')
      }

      // Update the profile with the new URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ [`${endpoint}_url`]: publicUrl })
        .eq('id', user.id)

      if (updateError) {
        console.error('Profile update error:', updateError)
        throw new Error('Failed to update profile with new image URL')
      }

      onUploadComplete(publicUrl)
      toast({
        title: "Upload Complete",
        description: `Your ${endpoint} has been updated successfully.`,
      })
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast({
        title: "Upload Failed",
        description: error.message || `Failed to upload ${endpoint}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset the file input
      const input = document.getElementById(`${endpoint}-upload`) as HTMLInputElement
      if (input) {
        input.value = ''
      }
    }
  }

  const handleClick = () => {
    const input = document.getElementById(`${endpoint}-upload`) as HTMLInputElement
    if (input) {
      input.click()
    }
  }

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={isUploading}
        id={`${endpoint}-upload`}
      />
    </div>
  )
}
