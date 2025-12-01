

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: '👥', trend: 'up', trendValue: '12%', color: 'blue' as const },
    { title: 'Active Sessions', value: '567', icon: '🔐', trend: 'up', trendValue: '5%', color: 'green' as const },
    { title: 'Monthly Revenue', value: '$12,345', icon: '💰', trend: 'up', trendValue: '8%', color: 'purple' as const },
    { title: 'System Health', value: '99.9%', icon: '⚡', trend: 'stable', trendValue: '0%', color: 'orange' as const },
  ];

  const quickActions = [
    { label: 'Manage Users', icon: '👥', onClick: () => console.log('Manage Users'), color: 'bg-blue-100 border-blue-300 text-blue-700' },
    { label: 'System Settings', icon: '⚙️', onClick: () => console.log('System Settings'), color: 'bg-purple-100 border-purple-300 text-purple-700' },
    { label: 'View Reports', icon: '📊', onClick: () => console.log('View Reports'), color: 'bg-green-100 border-green-300 text-green-700' },
    { label: 'Billing', icon: '💳', onClick: () => console.log('Billing'), color: 'bg-orange-100 border-orange-300 text-orange-700' },
  ];

  const activities = [
    { id: '1', type: 'user', description: 'New user registration', time: '2 minutes ago', user: 'John Doe', icon: '👤' },
    { id: '2', type: 'system', description: 'System backup completed', time: '1 hour ago', user: 'System', icon: '💾' },
    { id: '3', type: 'billing', description: 'Monthly subscription payment', time: '2 hours ago', user: 'Payment System', icon: '💳' },
    { id: '4', type: 'security', description: 'Security audit completed', time: '5 hours ago', user: 'Security Bot', icon: '🛡️' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-purple-100 mt-2 text-lg">
          Complete system control and administration
        </p>
      </div>



      {/* Additional Admin Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
              <span className="font-medium">Pending Approvals</span>
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-2">3</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
              <span className="font-medium">Active Users</span>
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full ml-2">1,231</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>CPU Usage</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Memory</span>
                <span>67%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">High memory usage detected</p>
              <p className="text-xs text-yellow-600 mt-1">10 minutes ago</p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800">Backup completed successfully</p>
              <p className="text-xs text-green-600 mt-1">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}