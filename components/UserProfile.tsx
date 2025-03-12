"use client";

import { useUser } from '@/contexts/UserContext';
import { authApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function UserProfile() {
  const { user, loading } = useUser();
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-4">
        <p>Please log in to view your profile</p>
        <button
          onClick={() => router.push('/login')}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleLogout = () => {
    authApi.logout();
    router.push('/login');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="space-y-2">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        {user.organization_id && (
          <p><strong>Organization ID:</strong> {user.organization_id}</p>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
} 