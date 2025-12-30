// src/app/dashboard/admin/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - SocialAI',
  description: 'System administration and management dashboard',
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Admin Quick Actions Banner */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, Admin!</h1>
            <p className="text-gray-600 mt-1">Manage your platform efficiently</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">System Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-bold mt-1">1,234</div>
          <div className="text-xs text-green-600">↑ 12% this month</div>
        </div>
        {/* ... rest of your dashboard content ... */}
      </div>
    </div>
  );
}