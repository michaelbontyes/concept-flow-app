'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/utils/supabase'
import { Button } from '@/components/ui/button'

export default function ClientAuthButton() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  // Get username from email (part before @) or use display name if available
  const displayName = user ? (user.user_metadata?.name || user.email?.split('@')[0] || 'User') : ''

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {displayName}!
      <Button 
        onClick={handleSignOut}
        variant="outline"
        size="sm"
      >
        Logout
      </Button>
    </div>
  ) : (
    <Button asChild variant="outline" size="sm">
      <Link href="/login">
        Login
      </Link>
    </Button>
  )
}
