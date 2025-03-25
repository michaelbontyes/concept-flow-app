import Header from '@/components/Header'
import UserProfile from '@/components/UserProfile'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import FormGeneratorCard from '@/components/FormGenerator/FormGeneratorCard'

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
    <div className="flex w-full flex-1 flex-col items-left gap-8">
      <Header />
      
      {isSupabaseConnected ? (
        <>
          <div className="w-full max-w-md mt-4">
            <FormGeneratorCard />
          </div>
          <UserProfile />
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Add other cards here */}
          </div>
        </>
      ) : (
        <div className="text-center p-8 bg-foreground/5 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Connect Supabase to get started</h2>
          <p>Please configure your Supabase credentials in the .env file</p>
        </div>
      )}
    </div>
  )
}
