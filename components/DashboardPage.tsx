'use client';

import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">Concept Flow</h1>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <span className="mr-4 text-sm font-medium text-gray-500">
                      {user?.name} ({user?.email})
                    </span>
                    <button
                      onClick={logout}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="py-10">
          <header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Welcome, {user?.name}!</h2>
                <p className="text-gray-600">You are now signed in to the Concept Flow application.</p>
                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">User Information:</h3>
                  <ul className="mt-2 list-disc list-inside text-gray-600">
                    <li>Name: {user?.name}</li>
                    <li>Email: {user?.email}</li>
                    <li>Role: {user?.role}</li>
                    <li>Organization ID: {user?.organization_id || 'Not assigned'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
} 