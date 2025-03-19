import AuthButton from '@/components/AuthButton'
import Header from '@/components/Header'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import ThemeToggle from '@/components/ThemeToggle'
import UserProfile from '@/components/UserProfile'

export default async function Index() {
  const cookieStore = cookies()

  const canInitSupabaseClient = () => {
    try {
      createServerClient(cookieStore)
      return true
    } catch (e) {
      return false
    }
  }

  const isSupabaseConnected = canInitSupabaseClient()

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8">
      <Header />
      
      {isSupabaseConnected ? (
        <UserProfile />
      ) : (
        <div className="text-center p-8 bg-foreground/5 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Connect Supabase to get started</h2>
          <p>Please configure your Supabase credentials in the .env file</p>
        </div>
      )}
    </div>
  )
}
