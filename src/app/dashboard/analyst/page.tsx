import DashboardLayout from '@/app/components/DashboardLayout';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import ResetToAdminButton from '@/app/components/dashboards/ResetToAdminButton';

export const metadata: Metadata = {
  title: 'Analyst Dashboard - SocialAI',
  description: 'Data analysis and performance insights dashboard',
};

export default async function AnalystDashboardPage() {
  const cookieStore = await cookies();
  const userRole = cookieStore.get('user-role')?.value;
  const originalRole = cookieStore.get('original-role')?.value;
  
  // Check if user is authenticated
  if (!userRole) {
    redirect('/auth');
  }
  
  // Only analyst can access this page
  if (userRole !== 'analyst') {
    redirect(`/dashboard/${userRole}`);
  }

  // Show reset button ONLY if original role was admin
  const showResetButton = originalRole === 'admin';

  return (
    
      <div className="space-y-6">
        {/* Analyst Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Track performance and gain insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                Generate Report
              </button>
              <button className="px-4 py-2 border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors text-sm font-medium">
                Export Data
              </button>
            </div>
          </div>
          
          {/* Only show ResetToAdminButton if admin switched to this role */}
          {showResetButton && <ResetToAdminButton />}
        </div>

        {/* Rest of your component remains the same */}
        {/* <AnalystDashboard /> */}
        
        {/* Real-time Data Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Live Data Stream
            </h3>
            <div className="space-y-3">
              {[
                { metric: 'Engagement Rate', value: '4.2%', change: '+0.3%', color: 'text-green-600' },
                { metric: 'Impressions', value: '1.2M', change: '+50K', color: 'text-blue-600' },
                { metric: 'Click-through', value: '3.1%', change: '+0.2%', color: 'text-purple-600' },
                { metric: 'Conversion', value: '2.4%', change: '+0.1%', color: 'text-orange-600' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="font-medium text-gray-700">{item.metric}</span>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{item.value}</div>
                    <div className={`text-xs ${item.color}`}>{item.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-center">
                <div className="text-blue-600 font-medium">Audience Analysis</div>
                <div className="text-xs text-gray-600 mt-1">Demographics & insights</div>
              </button>
              <button className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-center">
                <div className="text-green-600 font-medium">Top Content</div>
                <div className="text-xs text-gray-600 mt-1">Best performing posts</div>
              </button>
              <button className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-center">
                <div className="text-purple-600 font-medium">Patterns</div>
                <div className="text-xs text-gray-600 mt-1">Engagement trends</div>
              </button>
              <button className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-center">
                <div className="text-orange-600 font-medium">Export</div>
                <div className="text-xs text-gray-600 mt-1">PDF/CSV reports</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    
  );
}