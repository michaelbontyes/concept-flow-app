'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ClientAuthButton from '@/components/ClientAuthButton'

export default function NavBar() {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-background border-b border-b-foreground/10">
      <div className="flex h-16 max-w-6xl mx-auto items-center justify-between px-3">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-semibold">
            Concept Flow
          </Link>
        </div>
        
        {!isLoginPage && <ClientAuthButton />}
      </div>
    </nav>
  )
}
