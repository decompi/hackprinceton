'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from '@/lib/auth';
import { getUserProfile } from '@/lib/database';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user } = await getCurrentUser();
        if (user) {
          // Get user profile to get the name
          const { data: profile } = await getUserProfile(user.id);
          if (profile) {
            setUserName(profile.name || user.email?.split('@')[0] || 'User');
          } else {
            setUserName(user.email?.split('@')[0] || 'User');
          }
        } else {
          setUserName(null);
        }
      } catch (error) {
        setUserName(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]); // Re-check when route changes

  const handleSignOut = async () => {
    await signOut();
    setUserName(null);
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              AcneScan
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/about')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                About AI
              </Link>
              <Link
                href="/dermatologist"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/dermatologist')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Connect Dermatologist
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
            ) : userName ? (
              <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                Hello {userName}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

