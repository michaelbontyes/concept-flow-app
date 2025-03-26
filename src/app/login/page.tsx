'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@/utils/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'sign-in' | 'sign-up' | 'forgot-password'>('sign-in')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createBrowserClient()
  
  const initialMessage = searchParams.get('message')
  
  // Handle sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'user'
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) throw error
      setMessage('Check your email to confirm your account')
      setView('sign-in')
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle password reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) throw error
      setMessage('Check your email for password reset instructions')
      setView('sign-in')
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Concept Flow</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {view === 'sign-in' && 'Sign in to your account'}
            {view === 'sign-up' && 'Create a new account'}
            {view === 'forgot-password' && 'Reset your password'}
          </p>
        </div>
        
        {(error || message || initialMessage) && (
          <Alert variant={message || initialMessage?.includes('Check') ? 'default' : 'destructive'} className="my-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              {error || message || initialMessage}
            </AlertDescription>
          </Alert>
        )}
        
        {view === 'sign-in' && (
          <form onSubmit={handleSignIn} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
            
            <div className="flex items-center justify-between mt-4">
              <Button
                type="button"
                variant="link"
                className="text-sm"
                onClick={() => setView('forgot-password')}
              >
                Forgot password?
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-sm"
                onClick={() => setView('sign-up')}
              >
                Create account
              </Button>
            </div>
          </form>
        )}
        
        {view === 'sign-up' && (
          <form onSubmit={handleSignUp} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
            
            <div className="text-center mt-4">
              <Button
                type="button"
                variant="link"
                className="text-sm"
                onClick={() => setView('sign-in')}
              >
                Already have an account? Sign in
              </Button>
            </div>
          </form>
        )}
        
        {view === 'forgot-password' && (
          <form onSubmit={handlePasswordReset} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending reset link...' : 'Send reset link'}
            </Button>
            
            <div className="text-center mt-4">
              <Button
                type="button"
                variant="link"
                className="text-sm"
                onClick={() => setView('sign-in')}
              >
                Back to sign in
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function LoginClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
