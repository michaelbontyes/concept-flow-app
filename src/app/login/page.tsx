import Link from 'next/link'
import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function Login({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const signIn = async (formData: FormData) => {
    'use server'
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect(`/login?message=${encodeURIComponent(error.message)}`)
    }

    return redirect('/')
  }

  const signUp = async (formData: FormData) => {
    'use server'
    
    const origin = headers().get('origin')
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Create user in Supabase Auth
    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          role: 'user'
        },
        emailRedirectTo: `${origin}/api/auth/callback`,
      },
    })

    if (signUpError) {
      return redirect(`/login?message=${encodeURIComponent(signUpError.message)}`)
    }

    return redirect('/login?message=Check email to continue sign in process')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <Link
        href="/"
        className="absolute left-8 top-8 flex items-center rounded-md px-4 py-2 text-sm text-foreground no-underline hover:bg-foreground/5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>
      
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Concept Flow</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account or create a new one
          </p>
        </div>

        {searchParams?.message && (
          <Alert variant={searchParams.message.includes('Check email') ? 'default' : 'destructive'} className="my-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              {searchParams.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-card rounded-lg shadow-sm border p-8">
          <form className="space-y-6" action={signIn}>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex flex-col space-y-3">
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </div>
          </form>
          
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-medium mb-4">Create a new account</h3>
            <form className="space-y-4" action={signUp}>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="signup-name">
                  Full Name
                </label>
                <Input
                  id="signup-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="signup-email">
                  Email
                </label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="signup-password">
                  Password
                </label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <Button type="submit" variant="outline" className="w-full">
                Create Account
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
