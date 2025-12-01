"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileManager from './ProfileManager';
import RoleSwitcher from './RoleSwitcher';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  availableRoles: string[];
  image?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: string;
}

export default function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, [userRole]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/signout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side */}
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold text-blue-600">SocialAI</h1>
              <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </a>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Role Switcher */}
              {user && user.availableRoles && user.availableRoles.length > 1 && (
                <RoleSwitcher 
                  currentRole={userRole} 
                  availableRoles={user.availableRoles} 
                />
              )}

              {/* Single role indicator */}
              {user && (!user.availableRoles || user.availableRoles.length === 1) && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg border border-blue-200">
                  <span className="text-sm">
                    {userRole === 'admin' && '👑'}
                    {userRole === 'manager' && '👔'}
                    {userRole === 'creator' && '🎨'}
                    {userRole === 'analyst' && '📊'}
                    {userRole === 'client' && '💼'}
                  </span>
                  <span className="text-sm font-medium capitalize">{userRole}</span>
                </div>
              )}

              {/* Profile Button */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {user?.image ? (
                  <img 
                    src={user.image} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Profile Manager */}
      <ProfileManager 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </div>
  );
}