import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-8">
          There was an error during the authentication process.
          Please try signing in again.
        </p>
        <Button asChild>
          <Link href="/">Return to Sign In</Link>
        </Button>
      </div>
    </div>
  )
}
