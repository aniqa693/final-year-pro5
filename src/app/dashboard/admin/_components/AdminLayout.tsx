// app/components/admin/AdminLayout.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/app/components/dashboards/sidebars/AdminSidebar';
import RoleSwitcher from '@/app/components/RoleSwitcher';
import ProfileManager from '@/app/components/ProfileManager';



interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  availableRoles?: string[];
  image?: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

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

  // Role colors and icons
  const roleConfig = {
    admin: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '👑', gradient: 'from-purple-600 to-blue-600' },
    creator: { color: 'bg-pink-100 text-pink-800 border-pink-200', icon: '🎨', gradient: 'from-pink-500 to-rose-500' },
    analyst: { color: 'bg-green-100 text-green-800 border-green-200', icon: '📊', gradient: 'from-emerald-500 to-green-500' },
    manager: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '👔', gradient: 'from-blue-500 to-cyan-500' },
    client: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '💼', gradient: 'from-orange-500 to-amber-500' }
  };

  const currentRoleConfig = roleConfig['admin']; // Admin always uses admin styling

  // Admin has access to all roles
  const adminAvailableRoles = ['admin', 'creator', 'analyst', 'manager', 'client'];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Admin Sidebar */}
      <AdminSidebar 
        className={sidebarCollapsed ? 'w-20' : 'w-64'}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Admin Header */}
        <nav className="bg-white shadow-sm border-b">
          <div className="px-6">
            <div className="flex justify-between items-center h-16">
              {/* Left side */}
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {sidebarCollapsed ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                  )}
                </button>
                <h1 className="text-xl font-bold text-gray-900">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Admin Panel
                  </span>
                </h1>
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-4">
                {/* Role Switcher - Admin can switch to any role */}
                <RoleSwitcher 
                  currentRole="admin" 
                  availableRoles={adminAvailableRoles} 
                />

                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Button */}
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center space-x-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {user?.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                  )}
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t px-6 py-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              <span className="font-medium">SocialAI Admin</span> • All rights reserved © {new Date().getFullYear()}
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-gray-900">System Status</a>
              <a href="#" className="hover:text-gray-900">Documentation</a>
              <a href="#" className="hover:text-gray-900">Support</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Profile Manager */}
      <ProfileManager 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </div>
  );
}