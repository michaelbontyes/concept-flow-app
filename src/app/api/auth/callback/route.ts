import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the Auth Helpers package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?message=${encodeURIComponent(error.message)}`)
    }
    
    // Get the user data after successful authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      console.log('User authenticated:', user.id)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
